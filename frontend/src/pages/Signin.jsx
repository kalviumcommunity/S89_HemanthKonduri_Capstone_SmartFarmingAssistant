import React, { useState } from 'react';
import axios from 'axios';
import './Signin.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // <-- Import Auth hook

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth(); // <-- Get login function from context

    const handleBack = () => {
        navigate("/");
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await axios.post('http://localhost:5000/api/users/signin', {
                email,
                password,
            });

            if (response.data.success) {
                // Use the login function from context to update global state
                login(response.data.user, response.data.token);
                // The App.jsx routing will handle the redirect automatically
                // navigate('/homepage');
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
            <div className="signin-grid">
                <div className="back-arrow" onClick={handleBack}>←</div>
                <form className="signin-form-box" onSubmit={handleSignin}>
                    <h2 className="signin-title">Sign In</h2>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <label>Email</label>
                    <input className="signin-input" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label>Password</label>
                    <input className="signin-input" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button className="signin-btn" type="submit">Sign In</button>
                    <div className='forgot-password-container'>
                        <Link to="/forgotPassword" className="forgot-password-link">Forgot Password?</Link>
                    </div>
                    <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                </form>
            </div>
            <div className="signin-right">
                <img src="https://media.istockphoto.com/id/637583458/photo/hands-holding-and-caring-a-green-young-plant.jpg?s=612x612&w=0&k=20&c=vayQ471oZW7dTCeDJos5h4wH7SZqL4cbD-F-pZxj114=" id="plant-in-hand" alt="Plant in Hand" />
            </div>
        </div>
    );
};

export default Signin;