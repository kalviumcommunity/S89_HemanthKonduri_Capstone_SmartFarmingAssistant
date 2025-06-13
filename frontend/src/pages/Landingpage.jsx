import { useNavigate } from 'react-router-dom';
import './Landingpage.css';
import React from 'react';
import NavBar from '../components/NavBar'; // Updated import

const Landingpage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        // This button should probably lead to signup or signin if not logged in
        navigate('/signup');
    };

    return (
        <div className="get-started-container">
            <div className="overlay"></div>
            <NavBar /> {/* Use the shared, modern Navbar */}
            <div className="main-content">
                <h1>Grow Smarter, Farm Better</h1>
                <p className="sub-text">
                    Your digital assistant for crop planning, market prices, weather updates, and smart farm decisions.
                </p>
                <p className="trusted-text">Trusted by 10,000+ farmers across India</p>
                <button className="get-started-btn" onClick={handleGetStarted}>Get started</button>
            </div>
        </div>
    );
};

export default Landingpage;