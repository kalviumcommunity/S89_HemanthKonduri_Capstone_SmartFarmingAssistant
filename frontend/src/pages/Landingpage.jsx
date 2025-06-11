import { useNavigate } from 'react-router-dom';
import './Landingpage.css'; 
import React from 'react';
import mySapraLogo from '../assets/mySapraLogo.png'; // Adjust the path as necessary


const Landingpage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/homepage');
  };

  const handleSignin = () => {
    navigate('/signin');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

 

  return (
    <div className="get-started-container">
      <div className="overlay"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo" >
         <img src={mySapraLogo} alt="" />
         
        </div>
        <div className="nav-right">
          <button className="nav-btn" onClick={handleSignin}>Sign in</button>
          <button className="nav-btn" onClick={handleSignup}>Sign up</button>
         
        </div>
      </nav>

      {/* Main Content */}
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
