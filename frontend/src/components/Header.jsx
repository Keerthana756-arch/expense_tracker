import React from 'react';
import { Wallet, TrendingUp, Calendar, User, LogOut } from 'lucide-react';

export default function Header({ totalSpent, totalCount, user, onLogout }) {
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <div className="brand-icon">
            <Wallet className="icon-main" size={28} />
          </div>
          <div>
            <h1 className="brand-title">Daily Expense Tracker</h1>
            <p className="brand-subtitle">Monitor, budget, and understand your everyday spending</p>
          </div>
        </div>

        <div className="header-meta">
          <div className="meta-item">
            <Calendar size={16} />
            <span>{today}</span>
          </div>

          <div className="meta-badge">
            <TrendingUp size={16} />
            <span>{totalCount} {totalCount === 1 ? 'Expense' : 'Expenses'} Logged</span>
          </div>

          {user && (
            <div className="user-profile-badge">
              <div className="user-avatar" title={`Logged in as ${user.username}`}>
                <User size={15} />
                <span>{user.username}</span>
              </div>
              <button
                type="button"
                className="btn-logout"
                onClick={onLogout}
                title="Sign out of your account"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
