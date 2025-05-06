import React from "react";
import "./BottomBar.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1 */}
        <div className="footer-column">
          <h3>Smart Farming Assistant</h3>
          <p>
            Empowering farmers with technology – from AI tools to real-time
            support.
          </p>
        </div>

        {/* Column 2 */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/market-prices">Market Prices</a></li>
            <li><a href="/ai-chat">AI Chat</a></li>
            <li><a href="/products">Products</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-column">
          <h4>Contact Us</h4>
          <p>Email: support@smartfarming.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Location: Rajahmundry, India</p>
        </div>

        {/* Column 4 */}
        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384005.png" alt="Facebook" /></a>
            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384017.png" alt="Twitter" /></a>
            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384012.png" alt="Instagram" /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Smart Farming Assistant. All rights reserved.</p>
      </div>
    </footer>
  );
}
