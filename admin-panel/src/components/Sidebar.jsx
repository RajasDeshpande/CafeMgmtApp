import { NavLink, useNavigate } from 'react-router-dom';
import { IoGridOutline, IoRestaurantOutline, IoTimeOutline, IoLogOutOutline, IoCafeOutline, IoStatsChartOutline } from 'react-icons/io5';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <IoCafeOutline className="sidebar-brand-icon" />
        <span>TableTalk</span>
        <small>Admin</small>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <IoGridOutline /> Dashboard
        </NavLink>
        <NavLink to="/menu" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <IoRestaurantOutline /> Menu Manager
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <IoStatsChartOutline /> Analytics
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <IoTimeOutline /> Order History
        </NavLink>
      </nav>
      <button className="sidebar-logout" onClick={handleLogout}>
        <IoLogOutOutline /> Logout
      </button>
    </aside>
  );
}
