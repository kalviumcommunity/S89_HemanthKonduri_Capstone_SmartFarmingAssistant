import React, { useState } from 'react';
import axios from 'axios';
import './Signin.css'; 
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/")
  };

  const handleSignin = async (e) => {
e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post('http://localhost:5000/api/users/signin', {
        email,
        password,
      });

      if (response.data.success) {
        // Save the token in localStorage or sessionStorage
        localStorage.setItem('authToken', response.data.token);
        alert("Signed in successfully!");
        // Redirect to homepage or dashboard
        navigate('/homepage');
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage("An error occurred during sign-in.");
      console.log(error);
    }
  };

  return (
    <>
    <div className="signin-container">
      <div className="signin-grid">
        <div className="back-arrow" onClick={handleBack}>←</div>
       <form action="" className="signin-form-box"  onSubmit={handleSignin}>
          <h2 className="signin-title">Sign In</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <label>Email</label>
          <input className="signin-input"  type="email"  placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <label>Password</label>
          <input  className="signin-input" type="password"  placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <button className="signin-btn" type="submit">Sign In</button>
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
          </form>
      </div>
      <div className="signin-right">
     
          <img src="https://media.istockphoto.com/id/637583458/photo/hands-holding-and-caring-a-green-young-plant.jpg?s=612x612&w=0&k=20&c=vayQ471oZW7dTCeDJos5h4wH7SZqL4cbD-F-pZxj114=" id="plant-in-hand" alt="Plant in Hand" />
          
        
      </div>
      </div>
   
    </>
  );
};

export default Signin;
