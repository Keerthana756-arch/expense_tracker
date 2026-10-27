# ========================================================
# Stage 1: Build React Frontend
# ========================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ========================================================
# Stage 2: Build Spring Boot Backend
# ========================================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/pom.xml ./
# Cache Maven dependencies
RUN mvn dependency:go-offline -B || true

COPY backend/src ./src

# Copy built frontend assets into Spring Boot's static folder
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# Package executable JAR (named app.jar)
RUN mvn clean package -DskipTests

# ========================================================
# Stage 3: Minimal Production Runtime
# ========================================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create folder for H2 database persistence
RUN mkdir -p /app/data

# Copy packaged JAR from build stage
COPY --from=backend-builder /app/backend/target/app.jar app.jar

# Render exposes the PORT variable dynamically
ENV PORT=8080
ENV DATA_DIR=/app/data

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar app.jar"]
