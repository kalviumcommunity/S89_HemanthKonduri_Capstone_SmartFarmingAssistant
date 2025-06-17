import React, { useState } from 'react';
import axios from 'axios';
import './Signin.css'; // <-- Import Signin.css
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleBack = () => navigate("/");

    const handleSignin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            const response = await axios.post('http://localhost:5000/api/users/signin', { email, password });
            if (response.data.success) {
                login(response.data.user, response.data.token);
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "An error occurred during sign-in.");
            console.error(error);
        }
    };

    return (
        <div className="signin-container">
            <div className="back-arrow" onClick={handleBack}>←</div>
            <form className="signin-form-box" onSubmit={handleSignin}>
                <h2 className="signin-title">Welcome Back</h2>
                <p className="signin-subtitle">Sign in to continue your journey.</p>
                
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                
                <label htmlFor="email">Email</label>
                <input 
                    id="email"
                    className="signin-input" 
                    type="email" 
                    placeholder="e.g., farmer.brown@field.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                
                <label htmlFor="password">Password</label>
                <input 
                    id="password"
                    className="signin-input" 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                
                <div className='forgot-password-container'>
                    <Link to="/forgotPassword">Forgot Password?</Link>
                </div>

                <button className="signin-button" type="submit">Sign In</button>
                
                <p className="signin-redirect-link">
                    Don't have an account? <Link to="/signup">Create One</Link>
                </p>
            </form>
        </div>
    );
};

export default Signin;