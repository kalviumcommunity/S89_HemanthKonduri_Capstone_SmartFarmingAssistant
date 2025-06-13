import React, { useState } from "react";
import axios from "axios";
import "./Signup.css";
import { useNavigate, Link } from "react-router-dom";
import googleimg from "../assets/googleimg.png";
import { useAuth } from '../contexts/AuthContext'; // <-- Import Auth hook

const Signup = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth(); // <-- Get login function from context

    const handleBack = () => navigate("/");
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        const { name, email, password } = formData;
        if (!name || !email || !password) {
            setErrorMessage("All fields are required!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/users/signup", formData);
            if (response.data.success) {
                // Log the user in immediately after successful registration
                login(response.data.user, response.data.token);
                // The App.jsx routing will handle the redirect automatically
                // navigate('/homepage');
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            const message = error.response?.data?.message || "An error occurred while registering.";
            setErrorMessage(message);
            console.error(error);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/users/google";
    };

    return (
        <div className="signup-container">
            <div className="signup-left">
                <div className="back-arrow" onClick={handleBack}>←</div>
                <form className="signup-form-box" onSubmit={handleSignup}>
                    <h2 className="signup-title">Sign up</h2>
                    <button className="google-button" type="button" onClick={handleGoogleLogin}>
                        <img src={googleimg} alt="Google Logo" />
                        Continue with Google
                    </button>
                    <div className="or-divider">Or</div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <label>User name</label>
                    <input className="signup-input" type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
                    <label>Email</label>
                    <input className="signup-input" type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
                    <label>Password</label>
                    <input className="signup-input" type="password" name="password" placeholder="Enter your password (min 6 characters)" value={formData.password} onChange={handleChange} minLength="6" required />
                    <button className="signup-button" type="submit">Sign up</button>
                    <p>Already have an account? <Link to="/signin">Sign In</Link></p>
                </form>
            </div>
            <div className="signup-right">
                <img src="https://media.istockphoto.com/id/637583458/photo/hands-holding-and-caring-a-green-young-plant.jpg?s=612x612&w=0&k=20&c=vayQ471oZW7dTCeDJos5h4wH7SZqL4cbD-F-pZxj114=" id="plant-in-hand" alt="Plant in Hand" />
            </div>
        </div>
    );
};

export default Signup;