const express = require('express');
const { sendOtp, verifyOtp, userlogin, addProperty, eventproperty } = require('../controllers/controller');
const authorization = require('../middleware/authentication')
const router = express.Router();


router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login',userlogin)
router.post('/properties', addProperty);
router.post('/events',authorization,eventproperty)

module.exports = router ;