import React, { useState } from 'react';
import axios from 'axios';
import './forgotPassword.css';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/api/users/forgot-password', {
        email,
        newPassword: password,
      });

      if (response.data.success) {
        setSuccessMessage("Password reset successful! Signing in...");
        // Auto sign-in (optional)
        const signinResponse = await axios.post('http://localhost:5000/api/users/signin', {
          email,
          password,
        });
        localStorage.setItem('authToken', signinResponse.data.token);
        navigate('/homepage');
      } else {
        setErrorMessage(response.data.message || "Password reset failed");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred while resetting the password");
    }
  };

  return (
    <div className="forgotPassword-container">
      <div className="forgotPassword-grid">
        <div className="back-arrow" onClick={handleBack}>←</div>
        <form className="forgotPassword-form-box" onSubmit={handleResetPassword}>
          <h2 className="forgotPassword-title">Reset Password</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <label>Email</label>
          <input
            className="forgotPassword-input"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>New Password</label>
          <input
            className="forgotPassword-input"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <input
            className="forgotPassword-input"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button className="forgotPassword-btn" type="submit">
            Reset & Sign in
          </button>
        </form>
      </div>

      <div className="forgotPassword-right">
        <img
          src="https://media.istockphoto.com/id/637583458/photo/hands-holding-and-caring-a-green-young-plant.jpg?s=612x612&w=0&k=20&c=vayQ471oZW7dTCeDJos5h4wH7SZqL4cbD-F-pZxj114="
          id="plant-in-hand"
          alt="Plant in Hand"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
