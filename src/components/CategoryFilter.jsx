import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div className="category-filter">
      <button
        onClick={() => onSelect('All')}
        className={`glass-button cat-btn ${selectedCategory === 'All' ? 'active' : ''}`}
      >
        All Sports
      </button>
      {
        categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`glass-button cat-btn ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
    </div>
  );
};

export default CategoryFilter;
