// backend/controllers/googleAuthControllers.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const jwt =require("jsonwebtoken");
const config = require('../config/env.config'); // For secrets and URLs

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userEmail = profile.emails[0].value;
        let user = await User.findOne({ email: userEmail });

        if (user) {
          // If user exists, update their Google ID and avatar if missing
          user.googleId = user.googleId || profile.id;
          user.avatar = user.avatar || profile.photos?.[0]?.value;
          await user.save();
          return done(null, user);
        } else {
          // If user does not exist, create a new one
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: userEmail,
            avatar: profile.photos?.[0]?.value,
            // Password is not required for Google signup
          });
          await newUser.save();
          return done(null, newUser);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


// This is the middleware function that handles the callback from Google
const googleAuthCallbackHandler = (req, res) => {
  try {
    if (!req.user) {
      console.error("Google Auth Error: req.user is missing after authentication.");
      return res.redirect(`${config.clientURL}/signin?error=authentication-failed`);
    }

    // Create a JWT for the user
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Construct the redirect URL with user data as query parameters
    const frontendCallbackUrl = new URL(`${config.clientURL}/google-callback`);
    frontendCallbackUrl.searchParams.append("token", token);
    frontendCallbackUrl.searchParams.append("userId", req.user._id.toString());
    frontendCallbackUrl.searchParams.append("name", req.user.name);
    frontendCallbackUrl.searchParams.append("email", req.user.email);
    if (req.user.avatar) {
      frontendCallbackUrl.searchParams.append("avatar", req.user.avatar);
    }
    
    res.redirect(frontendCallbackUrl.toString());

  } catch (error) {
    console.error("Error in Google auth callback handler:", error);
    res.redirect(`${config.clientURL}/signin?error=server-processing-error`);
  }
};

// Export the handler function
module.exports = googleAuthCallbackHandler;