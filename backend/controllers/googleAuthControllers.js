const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/users/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, user);
        }

        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value || null,
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

const googleAuth = async (req, res) => {
  try {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
  httpOnly: true,
  secure: true, // Set to true in production (requires HTTPS)
  sameSite: "Lax", // Adjust as needed
  maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
});
res.redirect(`http://localhost:5174/google-callback`);

  } catch (error) {
    console.error("Google auth error:", error);
    res.redirect("http://localhost:5174/signin?error=google-auth-failed");
  }
};

module.exports =  googleAuth ;