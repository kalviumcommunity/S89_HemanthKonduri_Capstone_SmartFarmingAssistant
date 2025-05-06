import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const userId = params.get("userId");

        if (token && userId) {
          // Store token securely (e.g., in localStorage or HTTP-only cookie)
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          navigate("/homepage"); // Redirect to a protected route
        } else {
          throw new Error("Authentication failed: No token or userId");
        }
      } catch (error) {
        console.error("Google OAuth error:", error);
        navigate("/signin", { state: { error: "Google authentication failed" } });
      }
    };

    handleCallback();
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default GoogleCallback;