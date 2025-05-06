const express = require("express");
const passport = require("passport");
const { signup, signin, getUser } = require("../controllers/authControllers");
const googleAuth = require("../controllers/googleAuthControllers");

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Step 2: Google callback
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/signin" }), googleAuth);

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/get-user/:id", getUser);

module.exports = router;