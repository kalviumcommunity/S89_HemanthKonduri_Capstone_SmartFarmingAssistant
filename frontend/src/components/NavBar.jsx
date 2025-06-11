import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './NavBar.css';
import mySapraLogo from '../assets/mySapraLogo.png';

const NavBar = () => {
    const { currentUser, logout } = useAuth();
    const { totalQuantity } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState('');
    const isStorePage = location.pathname.startsWith('/saprastore');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.set('q', searchTerm);
        params.set('page', '1');
        navigate(`/saprastore?${params.toString()}`);
    };

    const toggleDropdown = () => setShowDropdown(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const defaultAvatar = "https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png";

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/homepage" className="logo-link">
                    <img src={mySapraLogo} alt="Sapra Logo" className="logo-image" />
                    <span className="logo-text">Sapra</span>
                </Link>
            </div>

            {/* --- CENTER SECTION --- */}
            <div className="navbar-center">
                {/* Main Navigation Links are now here */}
                <div className="nav-links">
                    <Link to="/saprastore" className="nav-link">Store</Link>
                    <Link to="/marketprices" className="nav-link">Market Prices</Link>
                    <Link to="/diseasedetection" className="nav-link">Scan Disease</Link>
                    <Link to="/chatwindows" className="nav-link">AI-Chat</Link>
                </div>
                
                {/* Search Bar */}
                <form className="nav-search-form" onSubmit={handleSearchSubmit}>
                    <input
                        type="search"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search products"
                    />
                    <button type="submit" aria-label="Search">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>
                    </button>
                </form>
            </div>

            {/* --- RIGHT SECTION --- */}
            <div className="navbar-right">
                <Link to="/cart" className="nav-icon-link cart-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>
                    {totalQuantity > 0 && <span className="cart-badge">{totalQuantity}</span>}
                </Link>

                {currentUser ? (
                    <div className="profile-container" ref={dropdownRef}>
                        <div className="profile-icon" onClick={toggleDropdown}>
                            <img src={currentUser.avatar || defaultAvatar} alt="Profile" />
                        </div>
                        {showDropdown && (
                            <div className="profile-dropdown">
                                <div className="dropdown-user-info">
                                    <strong>{currentUser.name}</strong>
                                    <small>{currentUser.email}</small>
                                </div>
                                <hr className="dropdown-divider" />
                                <Link to="/wallet" className="dropdown-item" onClick={toggleDropdown}>Sapra Wallet</Link>
                                <Link to="/my-orders" className="dropdown-item" onClick={toggleDropdown}>My Orders</Link>
                                <hr className="dropdown-divider" />
                                <button onClick={() => { logout(); toggleDropdown(); }} className="dropdown-logout-btn">Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/signin" className="nav-btn-signin">Sign In</Link>
                )}
            </div>
        </nav>
    );
};

export default NavBar;