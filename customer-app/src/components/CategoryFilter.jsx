export default function CategoryFilter({ categories, active, onSelect }) {
  return (
    <div className="category-filter">
      <button
        className={`filter-chip ${active === 'All' ? 'active' : ''}`}
        onClick={() => onSelect('All')}
      >
        🍽️ All
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          className={`filter-chip ${active === cat ? 'active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat === 'Beverages' && '☕'}{cat === 'Snacks' && '🥐'}
          {cat === 'Mains' && '🍕'}{cat === 'Desserts' && '🍰'}
          {' '}{cat}
        </button>
      ))}
    </div>
  );
}
