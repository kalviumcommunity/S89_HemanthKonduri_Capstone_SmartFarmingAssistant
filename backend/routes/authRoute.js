const express = require("express");

const { signup, signin } = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);


module.exports = router;