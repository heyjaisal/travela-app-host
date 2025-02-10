const express = require("express");

const {
  sendOtp,
  verifyOtp,
  userlogin,
  getHost,
  updateprofile,
  logout,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/authentication");
const router = express.Router();


router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", userlogin);
router.put("/profile", authMiddleware, updateprofile);
router.get("/profile", authMiddleware, getHost);
router.get("/logout",authMiddleware,logout)

module.exports = router;
