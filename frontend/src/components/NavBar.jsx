import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import seacrhicon from '../assets/searchicon.png'; // Adjust the path as necessary

const NavBar = () => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleSearch = () => {
    setShowSearch(prev => !prev);
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleMarketPrices = () => navigate('/marketprices');
  const handleChatWithAI = () => navigate('/aichat');
  const handleProducts = () => navigate('/buyProduts');
  const handleHome = () => navigate('/homepage');
  const handleLogout = () => {
    alert("Logged out");
    // your logout logic
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

  return (
    <div className='navbar-container'>
      <nav className="navbar">
        <div className="logo">
          <img src="" alt="Logo" />
          <span>SAPRA</span>
        </div>

        <div className="nav-right">
          <div className="search-icon" onClick={toggleSearch}>
            <img src={seacrhicon} alt="Search" />
          </div>

          {showSearch && (
            <div className="search-bar">
              <img src={seacrhicon} alt="Search" />
              <input type="text" placeholder="Search..." />
            </div>
          )}

          <button className="nav-btn" onClick={handleHome}>Home</button>
          <button className="nav-btn" onClick={handleMarketPrices}>Market Prices</button>
          <button className="nav-btn" onClick={handleChatWithAI}>AI-Chat</button>
          <button className="nav-btn">Scan Disease</button>
          <button className="nav-btn" onClick={handleProducts}>Buy Products</button>

          <div className="profile-container" ref={dropdownRef}>
            <div className="profile-icon" onClick={toggleDropdown}>
              <img
                src="https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"
                alt="Profile"
              />
            </div>

            {showDropdown && (
              <div className="profile-dropdown">
                <a href="#">Profile</a>
                <a href="#">Settings</a>
                <a href="#" onClick={handleLogout}>Logout</a>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
