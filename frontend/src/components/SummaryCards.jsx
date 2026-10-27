import React from 'react';
import { DollarSign, Layers, PieChart, Award } from 'lucide-react';
import { formatCurrency, getCategoryConfig } from '../utils/formatters';

export default function SummaryCards({ summary, selectedCategory, onSelectCategory }) {
  const totalAmount = summary?.totalAmount || 0;
  const totalCount = summary?.totalCount || 0;
  const breakdown = summary?.categoryBreakdown || {};

  // Find top category
  let topCategory = 'None';
  let topAmount = 0;
  Object.entries(breakdown).forEach(([cat, amt]) => {
    const val = Number(amt) || 0;
    if (val > topAmount) {
      topAmount = val;
      topCategory = cat;
    }
  });

  return (
    <div className="summary-section">
      <div className="summary-cards-grid">
        {/* Total Spent Card */}
        <div className="metric-card primary">
          <div className="metric-header">
            <span className="metric-label">Total Amount Spent</span>
            <div className="metric-icon-wrap primary">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="metric-value">{formatCurrency(totalAmount)}</div>
          <p className="metric-footer">Cumulative total across all recorded expenses</p>
        </div>

        {/* Total Expenses Count */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Transactions</span>
            <div className="metric-icon-wrap">
              <Layers size={20} />
            </div>
          </div>
          <div className="metric-value">{totalCount}</div>
          <p className="metric-footer">Individual expense entries recorded</p>
        </div>

        {/* Highest Spending Category */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Top Spending Category</span>
            <div className="metric-icon-wrap accent">
              <Award size={20} />
            </div>
          </div>
          <div className="metric-value top-cat">
            {topCategory !== 'None' ? topCategory : '—'}
          </div>
          <p className="metric-footer">
            {topAmount > 0 ? `${formatCurrency(topAmount)} spent` : 'No expenses recorded yet'}
          </p>
        </div>
      </div>

      {/* Visual Category Breakdown Progress Bars */}
      {totalAmount > 0 && (
        <div className="breakdown-card">
          <div className="breakdown-header">
            <div className="breakdown-title">
              <PieChart size={18} />
              <span>Spending by Category Breakdown</span>
            </div>
            <span className="breakdown-subtitle">Click a category below to filter</span>
          </div>

          <div className="breakdown-bars-container">
            {Object.entries(breakdown).map(([cat, amt]) => {
              const amountNum = Number(amt) || 0;
              if (amountNum <= 0) return null;
              const percent = totalAmount > 0 ? ((amountNum / totalAmount) * 100).toFixed(1) : 0;
              const config = getCategoryConfig(cat);
              const isSelected = selectedCategory === cat;

              return (
                <div
                  key={cat}
                  className={`breakdown-row ${isSelected ? 'active' : ''}`}
                  onClick={() => onSelectCategory(isSelected ? 'ALL' : cat)}
                  title={`Click to filter by ${cat}`}
                >
                  <div className="breakdown-row-info">
                    <span className="breakdown-cat-name" style={{ color: config.color }}>
                      <span className="color-dot" style={{ backgroundColor: config.color }}></span>
                      {cat}
                    </span>
                    <span className="breakdown-cat-amount">
                      {formatCurrency(amountNum)} ({percent}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: config.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

