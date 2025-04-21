import React from "react";
import "./Signup.css"; 

const Signup = () => {
  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="back-arrow">←</div>
        <div className="signup-form-box">
          <h2 className="signup-title">Sign up</h2>

          <button className="social-button google">
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
            Continue with Google
          </button>

          <button className="social-button facebook">
            <img src="https://img.icons8.com/color/16/000000/facebook-new.png" alt="Facebook" />
            Continue with Facebook
          </button>

          <div className="or-divider">Or</div>
            <label htmlFor="">User name</label>
          <input className="signup-input" type="text" placeholder="Enter your name" />
          <label htmlFor="">Email</label>
          <input className="signup-input" type="email" placeholder="Enter your email" />
          <label htmlFor="">Password</label>
          <input className="signup-input" type="password" placeholder="Enter password" />

          <button className="signup-button">Sign up</button>
        </div>
        <div>
            <p>Already have an account <a href="#">Sign In</a></p>
        </div>
      </div>

      <div className="signup-right">
        <div className="image-grid">
          <img src="https://media.istockphoto.com/id/637583458/photo/hands-holding-and-caring-a-green-young-plant.jpg?s=612x612&w=0&k=20&c=vayQ471oZW7dTCeDJos5h4wH7SZqL4cbD-F-pZxj114=" alt="Plant in Hand" />
          <img src="https://media.istockphoto.com/id/543212762/photo/tractor-cultivating-field-at-spring.jpg?s=612x612&w=0&k=20&c=uJDy7MECNZeHDKfUrLNeQuT7A1IqQe89lmLREhjIJYU=" alt="Tractor" />
          <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2VlZHxlbnwwfHwwfHx8MA%3D%3D" alt="Seeding" />
          <img src="https://plus.unsplash.com/premium_photo-1664527305901-a3c8bec62850?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmVnZXRhYmxlfGVufDB8fDB8fHww" alt="Vegetables" />
          <img src="https://plus.unsplash.com/premium_photo-1661811677567-6f14477aa1fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFybXxlbnwwfHwwfHx8MA%3D%3D" alt="Farm" className="wide" />
          <img src="https://plus.unsplash.com/premium_photo-1711238064361-7843b5b9bd9c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c29pbCUyMGluJTIwaGFuZHxlbnwwfHwwfHx8MA%3D%3D" alt="Soil in Hand" />
          <img src="https://images.unsplash.com/photo-1572775146189-b792cd0b76ba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGdyZWVuJTIwcGxhbnRzJTIwZmFybXxlbnwwfHwwfHx8MA%3D%3D" alt="Green Plant" />
          <img src="https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZhcm18ZW58MHx8MHx8fDA%3D" alt="Wheat" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
