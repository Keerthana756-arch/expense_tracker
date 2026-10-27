import React from 'react';
import { Filter, Search, ArrowUpDown, X, Tag } from 'lucide-react';
import { getCategoryConfig } from '../utils/formatters';

const CATEGORY_TABS = [
  { key: 'ALL', label: 'All Categories' },
  { key: 'Food', label: 'Food' },
  { key: 'Travel', label: 'Travel' },
  { key: 'Shopping', label: 'Shopping' },
  { key: 'Utilities', label: 'Utilities' },
  { key: 'Entertainment', label: 'Entertainment' },
  { key: 'Health', label: 'Health' },
  { key: 'Other', label: 'Other' },
];

export default function ExpenseFilters({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalFilteredCount,
  filteredTotalAmount,
  formatCurrency,
}) {
  const hasActiveFilters = selectedCategory !== 'ALL' || searchQuery.trim() !== '';

  const handleClearFilters = () => {
    onCategoryChange('ALL');
    onSearchChange('');
  };

  return (
    <div className="filter-controls-card">
      <div className="filter-top-bar">
        <div className="filter-title-wrap">
          <Filter size={18} className="filter-icon" />
          <span className="filter-title">Filter & Review Spending</span>
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={handleClearFilters}>
              <X size={14} />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Live Filter Summary */}
        <div className="filter-meta-stats">
          <span className="filter-count-badge">
            {totalFilteredCount} {totalFilteredCount === 1 ? 'expense' : 'expenses'}
          </span>
          <span className="filter-amount-badge">
            Total: <strong>{formatCurrency(filteredTotalAmount)}</strong>
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="category-pills-scroll">
        {CATEGORY_TABS.map((tab) => {
          const isSelected = selectedCategory === tab.key;
          const config = tab.key !== 'ALL' ? getCategoryConfig(tab.key) : null;

          return (
            <button
              key={tab.key}
              type="button"
              className={`cat-pill-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onCategoryChange(tab.key)}
              style={
                isSelected && config
                  ? {
                      backgroundColor: config.color,
                      borderColor: config.color,
                      color: '#ffffff',
                    }
                  : {}
              }
            >
              {tab.key !== 'ALL' && (
                <span
                  className="pill-dot"
                  style={{
                    backgroundColor: isSelected ? '#ffffff' : config.color,
                  }}
                />
              )}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search and Sort row */}
      <div className="search-sort-row">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search expenses by title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="sort-input-wrap">
          <ArrowUpDown size={16} className="sort-icon" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
          >
            <option value="date-desc">Date: Newest first</option>
            <option value="date-asc">Date: Oldest first</option>
            <option value="amount-desc">Amount: Highest first</option>
            <option value="amount-asc">Amount: Lowest first</option>
            <option value="title-asc">Title: A to Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}

