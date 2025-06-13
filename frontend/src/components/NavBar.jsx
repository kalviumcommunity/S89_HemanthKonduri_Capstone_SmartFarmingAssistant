// src/components/NavBar.jsx (The Correct, Final Version)

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import './NavBar.css'; // This will now correctly style the component
import mySapraLogo from '../assets/mySapraLogo.png';
import { useAuth } from '../contexts/AuthContext'; // Using the central auth state

const NavBar = () => {
    const { user, logout } = useAuth(); // Get user and logout function from context
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/');
    };

    // Effect to close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    return (
        // Use the correct "navbar-modern" class
        <nav className="navbar-modern">
            <Link to={user ? "/homepage" : "/"} className="navbar-logo-link">
                <img src={mySapraLogo} alt="MySapra Logo" className="navbar-logo-img" />
                <span>MySapra</span>
            </Link>

            {user && (
                <div className="navbar-links">
                    <NavLink to="/homepage" className="navbar-link">Home</NavLink>
                    <NavLink to="/diseasedetection" className="navbar-link">Disease Detection</NavLink>
                    <NavLink to="/chatwindows" className="navbar-link">AI Assistant</NavLink>
                    <NavLink to="/market-prices" className="navbar-link">Market</NavLink>
                    <NavLink to="/store" className="navbar-link">Store</NavLink>
                </div>
            )}

            <div className="navbar-right">
                {user ? (
                    // Use the correct "profile-menu" class
                    <div className="profile-menu" ref={dropdownRef}>
                        {/* Use the correct "profile-button" class */}
                        <button onClick={() => setShowDropdown(!showDropdown)} className="profile-button">
                            <img
                                src={user.avatar || defaultAvatar}
                                alt={user.name}
                                onError={(e) => e.target.src = defaultAvatar}
                            />
                        </button>

                        {showDropdown && (
                            <div className="profile-dropdown">
                                <div className="dropdown-header">
                                    <p className="dropdown-name">{user.name}</p>
                                    <p className="dropdown-email">{user.email}</p>
                                </div>
                                <div className="dropdown-divider"></div>
                                <button onClick={handleLogout} className="logout-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                                        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/signin" className="navbar-button signin">Sign In</Link>
                        <Link to="/signup" className="navbar-button signup">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;