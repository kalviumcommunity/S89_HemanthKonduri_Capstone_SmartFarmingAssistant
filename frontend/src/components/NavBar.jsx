// frontend/src/NavBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Use Link for navigation
import './NavBar.css';
import mySapraLogo from '../assets/mySapraLogo.png'; // Adjust the path

const NavBar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check for logged-in user on component mount and on storage change
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('currentUser');
      if (token && storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing stored user data:", e);
          // Clear invalid data
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    checkAuth(); // Initial check

    // Listen for storage changes (e.g., from other tabs, though less common for SPAs)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // This effect can be used to react to currentUser changes if needed elsewhere,
  // or if you want to redirect if user becomes null after being logged in.
  // For now, just logging for demonstration.
  // useEffect(() => {
  //   if (currentUser) {
  //     console.log("User is logged in:", currentUser);
  //   } else {
  //     console.log("User is logged out or not logged in.");
  //   }
  // }, [currentUser]);


  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setCurrentUser(null); // Update state
    setShowDropdown(false); // Close dropdown
    alert("You have been logged out.");
    navigate('/'); // Navigate to home or sign-in page
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Default avatar if user.avatar is null or empty
  const defaultAvatar = "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png";

  
 

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="logo-link"> {/* Use Link for logo navigation */}
          <div className="logo">
            <img src={mySapraLogo} alt="MySapra Logo"/>
          </div>
        </Link>

        <div className="nav-links"> {/* Group navigation links */}
          <Link to="/homepage" className="nav-btn">Home</Link>
          <Link to="/marketprices" className="nav-btn">Market Prices</Link>
          <Link to="/chatwindows" className="nav-btn">AI-Chat</Link>
          <Link to="/diseasedetection" className="nav-btn">Disease-Detection</Link> {/* Assuming a route */}
          <Link to="/store" className="nav-btn">Sapra Store</Link>
        </div>
      

        <div className="nav-right">
          {currentUser ? (
            <div className="profile-container" ref={dropdownRef}>
              <div className="profile-icon" onClick={toggleDropdown} title="Profile and options">
                <img
                  src={currentUser.avatar || defaultAvatar}
                  alt={currentUser.name || "Profile"}
                  onError={(e) => e.target.src = defaultAvatar} // Fallback for broken avatar links
                />
              </div>

              {showDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-user-info">
                    <strong>{currentUser.name}</strong>
                    <small>{currentUser.email}</small>
                  </div>
                  <hr className="dropdown-divider" />
              
                  <button onClick={handleLogout} className="dropdown-logout-btn">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/signin" className="nav-btn signin-link-nav">Sign In</Link>
              {/* <Link to="/signup" className="nav-btn signup-link-nav">Sign Up</Link> */}
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;