import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="logo">
            MedExplain AI
          </Link>
          
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/reports" className="nav-link">
              My Reports
            </Link>
            <Link to="/history" className="nav-link">
              History
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <span className="nav-link">
              Welcome, {user?.full_name || user?.username}
            </span>
            <button 
              onClick={signOut}
              className="btn btn-secondary"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;