package com.expensetracker.service.impl;

import com.expensetracker.dto.AuthResponse;
import com.expensetracker.dto.LoginRequest;
import com.expensetracker.dto.RegisterRequest;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.AuthService;
import com.expensetracker.util.PasswordUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new IllegalArgumentException("Username '" + username + "' is already taken.");
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email '" + email + "' is already registered.");
        }

        String salt = PasswordUtil.generateSalt();
        String hash = PasswordUtil.hashPassword(request.getPassword(), salt);

        User user = new User(username, email, hash, salt);
        String token = UUID.randomUUID().toString();
        user.setSessionToken(token);

        User saved = userRepository.save(user);

        return new AuthResponse(
                token,
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                "Registration successful"
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getUsernameOrEmail().trim();

        Optional<User> userOpt = userRepository.findByUsernameIgnoreCase(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmailIgnoreCase(identifier.toLowerCase());
        }

        User user = userOpt.orElseThrow(() -> new IllegalArgumentException("Invalid username/email or password."));

        boolean valid = PasswordUtil.verifyPassword(request.getPassword(), user.getSalt(), user.getPasswordHash());
        if (!valid) {
            throw new IllegalArgumentException("Invalid username/email or password.");
        }

        String token = UUID.randomUUID().toString();
        user.setSessionToken(token);
        userRepository.save(user);

        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                "Login successful"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse getCurrentUser(String token) {
        User user = resolveUser(token);
        return new AuthResponse(
                user.getSessionToken(),
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                "Active session"
        );
    }

    @Override
    public void logout(String token) {
        if (token != null && !token.trim().isEmpty()) {
            String cleanToken = cleanToken(token);
            userRepository.findBySessionToken(cleanToken).ifPresent(user -> {
                user.setSessionToken(null);
                userRepository.save(user);
            });
        }
    }

    @Override
    @Transactional(readOnly = true)
    public User resolveUser(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Authentication required: missing token");
        }
        String cleanToken = cleanToken(token);
        return userRepository.findBySessionToken(cleanToken)
                .orElseThrow(() -> new IllegalArgumentException("Session expired or invalid. Please sign in again."));
    }

    private String cleanToken(String token) {
        if (token.startsWith("Bearer ")) {
            return token.substring(7).trim();
        }
        return token.trim();
    }
}

