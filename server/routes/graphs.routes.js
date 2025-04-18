const express = require('express');
const { getBookingStats, monthlyPayment, LatestBookings } = require('../controllers/graphs.controller');
const authMiddleware = require('../middleware/authentication');

const router = express.Router();

router.get('/line-graph',authMiddleware, getBookingStats)
router.get('/monthly-payments',authMiddleware, monthlyPayment)
router.get('/latest-bookings',authMiddleware, LatestBookings)

module.exports = router;
