const express = require('express');
const { sendOtp, verifyOtp, userlogin } = require('../controllers/controller');
const router = express.Router();


router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login',userlogin)

module.exports = router ;