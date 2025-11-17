import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          CampusExe
        </Link>
        {user && (
          <div className="navbar-menu">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/resources" className="nav-link">Resources</Link>
            <Link to="/interaction" className="nav-link">Interaction</Link>
            <Link to="/reports" className="nav-link">Feedback</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/events" className="nav-link">Events</Link>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              {user.role === 'student' && <span className="user-points">⭐ {user.points || 0} pts</span>}
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

