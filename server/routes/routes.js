const express = require('express');
const { sendOtp, verifyOtp, userlogin, addProperty, eventproperty } = require('../controllers/controller');
const router = express.Router();


router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login',userlogin)
router.post('/properties', addProperty);
router.post('/events',eventproperty)

module.exports = router ;