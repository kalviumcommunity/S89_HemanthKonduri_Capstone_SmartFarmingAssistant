import React, { useState } from "react";
import axios from "axios";
import './Signup.css'; // <-- Import Signup.css
import { useNavigate, Link } from "react-router-dom";
import googleimg from "../assets/googleimg.png";
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleBack = () => navigate("/");
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            const response = await axios.post("http://localhost:5000/api/users/signup", formData);
            if (response.data.success) {
                login(response.data.user, response.data.token);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "An error occurred while registering.");
            console.error(error);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/users/google";
    };

    return (
        <div className="signup-container">
            <div className="back-arrow" onClick={handleBack}>←</div>
            <form className="signup-form-box" onSubmit={handleSignup}>
                <h2 className="signup-title">Join the Harvest</h2>
                <p className="signup-subtitle">Create an account to get started.</p>

                <button className="google-button" type="button" onClick={handleGoogleLogin}>
                    <img src={googleimg} alt="Google Logo" />
                    Continue with Google
                </button>
                <div className="or-divider">Or</div>

                {errorMessage && <div className="error-message">{errorMessage}</div>}
                
                <label htmlFor="name">User Name</label>
                <input 
                    id="name"
                    className="signup-input" 
                    type="text" 
                    name="name" 
                    placeholder="e.g., Farmer Brown" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                />
                
                <label htmlFor="email">Email</label>
                <input 
                    id="email"
                    className="signup-input" 
                    type="email" 
                    name="email" 
                    placeholder="e.g., farmer.brown@field.com" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                />

                <label htmlFor="password">Password</label>
                <input 
                    id="password"
                    className="signup-input" 
                    type="password" 
                    name="password" 
                    placeholder="Minimum 6 characters" 
                    value={formData.password} 
                    onChange={handleChange} 
                    minLength="6" 
                    required 
                />

                <button className="signup-button" type="submit">Create Account</button>
                
                <p className="signup-redirect-link">
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;