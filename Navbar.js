import React, { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css"; // Assuming you have styles for the sidebar and overlay
import { BsInstagram, BsFacebook } from "react-icons/bs";
import { Link } from "react-router-dom";
import InstantBookModal from "./InstantBookModal"; // Import the modal component

const Navbar = ({ handleShow }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prevState) => !prevState);
  }, []);

  // Function to close sidebar
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Close sidebar when pressing ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSidebar]);

  return (
    <>
      {/* Main Navbar */}
      <nav className="navbar fixed-top navbar-dark bg-black">
        <a className="navbar-brand" href="/">
          <img
            src="/dubai-music-white-logo.webp"
            width="150px"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </a>

        <div className="d-flex">
          {/* Toggle icon */}

          <div className="navbar-toggler" onClick={toggleSidebar}>
            <div className={`hamburger-icon ${isSidebarOpen ? "open" : ""}`}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          </div>
          {/* Toggle iCON */}

          <ul>
            <li className="instant-btn">
              <button
                type="button"
                className="btn homeBtn"
                data-bs-toggle="modal"
                data-bs-target="#instantBookModal"
              >
                Instant Book
              </button>
            </li>
          </ul>
          <InstantBookModal />
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`screen-overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <div className={`mobile-offcanvas ${isSidebarOpen ? "show" : ""}`}>
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
        <ul className="sidebar-nav">
        <a className="navbar-brand" href="/">
          <img
            src="/dubai-music-white-logo.webp"
            width="150px"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </a>
          <li className="nav-item">
            <NavLink
              exact="true"
              to="/"
              className="nav-link"
              onClick={closeSidebar}
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              exact="true"
              to="/venues"
              className="nav-link"
              onClick={closeSidebar}
            >
              Venues
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/favorites"
              className="nav-link"
              onClick={closeSidebar}
            >
              Favorites
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/about" className="nav-link" >
              About
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="https://jobs.dubaimusic.com" className="nav-link" onClick={closeSidebar}>
              Jobs
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="https://jobs.dubaimusic.com/submit-job/" className="nav-link" onClick={closeSidebar}>
              Post a Job
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="https://www.melodyhousemi.com/?srsltid=AfmBOopaD6HxDv6YM8XM-2R3fHFGOAfS1H-fIqxxzHPxvKuGhlPBoh7y" className="nav-link" target="_blank" onClick={closeSidebar}>
            Music Store
            </NavLink>
          </li>
          <div className="social-icons">
            <Link to="https://www.instagram.com/dubaimusic" target="_blank">
              {" "}
              <BsInstagram />{" "}
            </Link>
            <Link to="https://www.facebook.com/dubaimusic.comm" target="_blank">
              <BsFacebook />
            </Link>
            
          </div>
          

        </ul>
      </div>
    </>
  );
};

export default Navbar;