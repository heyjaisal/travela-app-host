const express = require('express');
const authorization = require('../middleware/authentication');
const { DeletebyType, getItemsByType, BookedListings, detailList } = require('../controllers/listing.controller');
const authMiddleware = require('../middleware/authentication');

const router = express.Router();

router.get('/all-items',authorization,getItemsByType);
router.get('/details/:id',detailList);
router.get('/bookings',authMiddleware,BookedListings);
router.delete('/delete/:id',authorization,DeletebyType);

module.exports = router;
