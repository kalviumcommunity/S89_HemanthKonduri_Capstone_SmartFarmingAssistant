import React from 'react'
import "./Landingpage.css"; // Import the CSS file for styling  

const Landingpage = () => {
  return (
    <div className="get-started-container">
    <div className="overlay"></div>

    {/* Navbar */}
    <nav className="navbar">
      <div className="logo">
        <img src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-384c-51f7-b4ac-422f29271382/raw?se=2025-04-08T11%3A08%3A02Z&sp=r&sv=2024-08-04&sr=b&scid=046b6835-5785-50ff-97d7-acbd20533381&skoid=a3336399-497e-45e5-8f28-4b88ecca3d1f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-08T05%3A28%3A03Z&ske=2025-04-09T05%3A28%3A03Z&sks=b&skv=2024-08-04&sig=HxPSv78R9xBRdjBVKdoHRzTXC7zZqrCXc8hEJ0UciiI%3D" alt="Logo" />
        <span>Smart farming assistant</span>
      </div>
      <div className="nav-right">
        <button className="nav-btn">Sign in</button>
        <button className="nav-btn">Sign up</button>
        <select className="lang-select">
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="te">తెలుగు</option>
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
      <button className="get-started-btn">Get started</button>
    </div>
  </div>
  )
}

export default Landingpage