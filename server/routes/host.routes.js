const express = require('express');
const authorization = require('../middleware/authentication');
const { DeletebyType, getItemsByType } = require('../controllers/host.controller');

const router = express.Router();

router.get('/all-items',authorization,getItemsByType);
router.delete('/delete/:id',authorization,DeletebyType)


module.exports = router;
