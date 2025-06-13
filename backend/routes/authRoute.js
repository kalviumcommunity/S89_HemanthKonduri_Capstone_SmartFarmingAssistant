// backend/routes/authRoute.js
const express = require("express");
const passport = require("passport");
const { signup, signin, getUser, forgotPassword } = require("../controllers/authControllers");
// This import now correctly matches the export from googleAuthControllers.js
const googleAuthCallbackHandler = require("../controllers/googleAuthControllers");

const router = express.Router();

const FRONTEND_URL = "http://localhost:5173";

// Step 1: Redirect to Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}/signin?error=google-auth-failed`,
    session: true, // Session is required for the passport OAuth flow
  }),
  googleAuthCallbackHandler 
);

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/get-user/:id", getUser); 
router.put("/forgot-password", forgotPassword);

module.exports = router;