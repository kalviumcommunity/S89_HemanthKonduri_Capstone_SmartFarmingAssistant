import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const handleMarketPrices = () => {
    navigate('/marketprices');
  };

  const handleChatWithAI = () =>{
    navigate('/aichat');
  }
  const hamdleProducts = () =>{
    navigate('/buyproducts');
  }

  const handleHome = () => {
    navigate('/homepage');
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className='navbar-container'>
      <nav className="navbar">
        <div className="logo">
          <img src="" alt="Logo" />
          <span>SAPRA</span>
        </div>

        <div className="nav-right">
          <div className="search-icon" onClick={toggleSearch}>
            
          </div>

          {showSearch && (
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
            </div>
          )}

          <button className="nav-btn" onClick={handleHome}>Home</button>
          <button className="nav-btn" onClick={handleMarketPrices}>Market Prices</button>
          <button className="nav-btn" onClick={handleChatWithAI}>AI-Chat</button>
          <button className="nav-btn">Scan Disease</button>
          <button className="nav-btn" onClick={hamdleProducts}>Buy Products</button>

        

          <span className="profile-icon">👤</span>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
