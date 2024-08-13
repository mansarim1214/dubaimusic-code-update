import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; // Assuming you have styles for the sidebar and overlay

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState);
  }, []);

  // Function to close sidebar
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Close sidebar when pressing ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeSidebar]);

  return (
    <>
      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-black px-3">
        <a className="navbar-brand" href="/">
          <img
            src="/dubai-music-white-logo.webp"
            width="150px"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </a>

        <div className="navbar-toggler" onClick={toggleSidebar}>
          <div className={`hamburger-icon ${isSidebarOpen ? 'open' : ''}`}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>

        <div className="collapse navbar-collapse t-right" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink exact="true" to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact="true" to="/venues" className="nav-link">
                Venues
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/favorites" className="nav-link">
                Favorites
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`screen-overlay ${isSidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <div className={`mobile-offcanvas ${isSidebarOpen ? 'show' : ''}`}>
        <div className="offcanvas-header">
          <button
            className="btn-close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            aria-expanded={isSidebarOpen}
          >
            &times;
          </button>
        </div>
        <ul className="sidebar-nav d-lg-none">
          <a className="navbar-brand" href="/">
            <img
              src="/dubai-music-white-logo.webp"
              width="150px"
              className="d-inline-block align-top"
              alt="Logo"
            />
          </a>
          <li className="nav-item">
            <NavLink exact="true" to="/" className="nav-link" onClick={closeSidebar}>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink exact="true" to="/venues" className="nav-link" onClick={closeSidebar}>
              Venues
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/favorites" className="nav-link" onClick={closeSidebar}>
              Favorites
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
