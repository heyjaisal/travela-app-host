const express = require('express');
const { sendOtp, verifyOtp, userlogin, addProperty, eventproperty, updateprofile, getHost } = require('../controllers/controller');
const authorization = require('../middleware/authentication')
const router = express.Router();


router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login',userlogin)
router.post('/properties',authorization, addProperty);
router.post('/events',authorization,eventproperty)
router.put('/profile',authorization,updateprofile)
router.get('/profile',authorization,getHost)

module.exports = router ;