// frontend/src/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './forgotPassword.css'; // Ensure this CSS provides the two-column layout
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "", // Renamed from newPassword for consistency if you like
    confirmPassword: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/signin"); // Go back to signin page
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
        setErrorMessage("All fields are required.");
        setIsLoading(false);
        return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        setIsLoading(false);
        return;
    }

    try {
      const response = await axios.put('http://localhost:5000/api/users/forgot-password', {
        email,
        newPassword: password, // Backend expects newPassword
      });

      if (response.data.success) {
        setSuccessMessage("Password reset successful! Signing you in...");
        
        // Attempt to auto sign-in
        try {
            const signinResponse = await axios.post('http://localhost:5000/api/users/signin', {
                email,
                password, // Use the new password
            });

            if (signinResponse.data.success && signinResponse.data.token && signinResponse.data.user) {
                localStorage.setItem('authToken', signinResponse.data.token);
                localStorage.setItem('currentUser', JSON.stringify(signinResponse.data.user));
                // Short delay to allow user to see success message
                setTimeout(() => {
                    navigate('/homepage');
                }, 1500);
            } else {
                // Auto sign-in failed, prompt user to sign in manually
                setErrorMessage(signinResponse.data.message || "Auto sign-in failed. Please sign in manually.");
                setTimeout(() => navigate('/signin'), 2000); // Redirect to signin after showing message
            }
        } catch (signinError) {
            setErrorMessage("Password reset, but auto sign-in failed. Please sign in manually.");
            setTimeout(() => navigate('/signin'), 2000);
        }
      } else {
        setErrorMessage(response.data.message || "Password reset failed. Please try again.");
      }
    } catch (error) {
      const message = error.response?.data?.message || "An error occurred while resetting the password.";
      setErrorMessage(message);
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgotPassword-container"> {/* This should be styled for two columns */}
      <div className="forgotPassword-left"> {/* Form side */}
        <div className="back-arrow" onClick={handleBack}>←</div>
        <form className="forgotPassword-form-box" onSubmit={handleResetPassword}>
          <h2 className="forgotPassword-title">Reset Password</h2>
          
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="forgotPassword-input"
            type="email"
            name="email"
            placeholder="Enter your registered email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">New Password</label>
          <input
            id="password"
            className="forgotPassword-input"
            type="password"
            name="password"
            placeholder="Enter new password (min. 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />

          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            className="forgotPassword-input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
          />

          <button className="forgotPassword-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset & Sign in"}
          </button>
          <p className="auth-switch-link">
            Remembered your password? <Link to="/signin">Sign In</Link>
          </p>
        </form>
      </div>
      <div className="forgotPassword-right"> {/* Image side */}
        <img
          src="https://media.istockphoto.com/id/637583458/photo/hands-holding-and-caring-a-green-young-plant.jpg?s=612x612&w=0&k=20&c=vayQ471oZW7dTCeDJos5h4wH7SZqL4cbD-F-pZxj114="
          alt="Farming"
          className="auth-image"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;