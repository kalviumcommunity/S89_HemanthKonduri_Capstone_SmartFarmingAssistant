const express = require("express");

const { signup, signin, getUser } = require("../controllers/authControllers");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/get-user/:id", getUser)


module.exports = router;