import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { IoCartOutline, IoCafeOutline } from 'react-icons/io5';

export default function Navbar() {
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <IoCafeOutline className="brand-icon" />
          <span className="brand-text">TableTalk</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Menu
          </Link>
          <Link to="/cart" className="cart-link">
            <IoCartOutline className="cart-icon" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
