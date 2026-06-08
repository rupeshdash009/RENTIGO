const express = require("express");

const {
  registerUser,
  loginUser,
  createAdmin,
} = require("../controllers/authControllers");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Secret Postman-only admin creation route
router.post("/create-admin", createAdmin);

module.exports = router;
