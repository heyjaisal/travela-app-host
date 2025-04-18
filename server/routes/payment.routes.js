const express = require("express");

const authMiddleware = require("../middleware/authentication");
const { connectStripeAccount } = require("../controllers/payment.controller");
const router = express.Router();


router.post("/connect-stripe",authMiddleware, connectStripeAccount);

module.exports = router;
