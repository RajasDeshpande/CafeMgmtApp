import { useState, useEffect } from 'react';
import { menuAPI } from '../services/api';
import MenuCard from '../components/MenuCard';
import CategoryFilter from '../components/CategoryFilter';
import { IoFlameSharp, IoSearchOutline } from 'react-icons/io5';

const CATEGORIES = ['Beverages', 'Snacks', 'Mains', 'Desserts'];

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, popularRes] = await Promise.all([
          menuAPI.getAll(),
          menuAPI.getPopular(),
        ]);
        setMenuItems(menuRes.data);
        setPopularItems(popularRes.data);
      } catch (err) {
        console.error('Failed to fetch menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Brewing your menu...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="accent">TableTalk</span>
          </h1>
          <p className="hero-subtitle">
            Crafted with passion, served with love. Browse our menu and order right from your table.
          </p>
        </div>
        <div className="hero-glow"></div>
      </section>

      {/* Most Ordered Section */}
      {popularItems.length > 0 && (
        <section className="popular-section">
          <h2 className="section-title">
            <IoFlameSharp className="flame-icon" /> Most Ordered
          </h2>
          <div className="popular-grid">
            {popularItems.slice(0, 5).map(item => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Full Menu */}
      <section className="menu-section">
        <h2 className="section-title">Our Menu</h2>
        <div className="menu-controls">
          <div className="search-bar">
            <IoSearchOutline className="search-icon" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="menu-search"
            />
          </div>
          <CategoryFilter categories={CATEGORIES} active={activeCategory} onSelect={setActiveCategory} />
        </div>
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <p>No items found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredItems.map(item => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
