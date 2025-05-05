import { useNavigate } from 'react-router-dom';
import './Landingpage.css'; 
import React from 'react';

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

  const [language, setLanguage] = React.useState("en");
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div className="get-started-container">
      <div className="overlay"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="idea-logo">
          <img src="" alt="Logo" />
          <span>SAPRA</span>
        </div>
        <div className="nav-right">
          <button className="nav-btn" onClick={handleSignin}>Sign in</button>
          <button className="nav-btn" onClick={handleSignup}>Sign up</button>
          <select className="lang-select" onChange={handleLanguageChange} value={language}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="te">తెలుగు</option>
            <option value="ta">தமிழ்</option>
            <option value="ml">മലയാളം</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
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
