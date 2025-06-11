// backend/controllers/googleAuthControllers.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const jwt = require("jsonwebtoken"); // Ensure this is `require`
const dotenv = require("dotenv");
dotenv.config();

// This part is executed on server start
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/users/google/callback", // Relative URL is robust
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          // If user exists, ensure their Google-specific info is up-to-date
          if (!user.googleId) {
            user.googleId = profile.id;
            user.avatar = user.avatar || profile.photos?.[0]?.value;
            await user.save();
          }
          return done(null, user);
        }

        // If user does not exist, create a new one
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value || null,
          isVerified: true, // Google users are verified
        });
        await user.save();
        done(null, user);
      } catch (error) {
        done(error, null);
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

// <<< CRITICAL FIX: Renamed function and reverted to URL param logic
const googleAuthCallbackHandler = async (req, res) => {
  const FRONTEND_URL = "http://localhost:5173";
  try {
    if (!req.user) {
      return res.redirect(`${FRONTEND_URL}/signin?error=google-auth-failed-no-user`);
    }

    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    
    // <<< CRITICAL FIX: Sending data via URL parameters, NOT cookies
    // This now matches what your GoogleCallback.jsx expects.
    const frontendCallbackUrl = new URL(`${FRONTEND_URL}/google-callback`);
    frontendCallbackUrl.searchParams.append("token", token);
    frontendCallbackUrl.searchParams.append("userId", req.user._id.toString());
    frontendCallbackUrl.searchParams.append("name", req.user.name);
    frontendCallbackUrl.searchParams.append("email", req.user.email);
    if (req.user.avatar) {
      frontendCallbackUrl.searchParams.append("avatar", req.user.avatar);
    }

    res.redirect(frontendCallbackUrl.toString());

  } catch (error) {
    console.error("Google auth callback handler error:", error);
    res.redirect(`${FRONTEND_URL}/signin?error=google-auth-processing-failed`);
  }
};

// <<< CRITICAL FIX: Exporting the correctly named function
module.exports = googleAuthCallbackHandler;