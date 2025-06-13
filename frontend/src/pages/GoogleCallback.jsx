import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // <-- Import Auth hook

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth(); // <-- Get login function

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        
        // Extract all user data from URL params
        const user = {
            _id: params.get("userId"),
            name: params.get("name"),
            email: params.get("email"),
            avatar: params.get("avatar"),
        };

        if (token && user._id && user.email) {
            // Use the login function to set the global auth state
            login(user, token);
            // Navigate to homepage. App.jsx will handle this, but an explicit redirect is fine.
            navigate("/homepage", { replace: true });
        } else {
            // Handle error case
            console.error("Google OAuth failed: Missing token or user data in callback.");
            navigate("/signin", { 
                replace: true, 
                state: { error: "Google authentication failed. Please try again." } 
            });
        }
    }, [location, navigate, login]);

    // Render a loading indicator while processing
    return <div>Authenticating with Google... Please wait.</div>;
};

export default GoogleCallback;