import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar px-4 py-3 shadow-sm sticky-top navbar-themed">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-4 text-white" to="/">
          <span className="me-2 fs-3">🌱</span>
          <span className="brand-text">
            Growth<span className="brand-accent">Hub</span>
          </span>
        </Link>
        
        {isAuthenticated && (
          <div className="d-flex align-items-center ms-auto">
            <span className="text-light me-4 d-none d-md-inline-block" style={{ opacity: 0.85 }}>
              Logged in as: <strong className="brand-accent">{user?.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-logout btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
