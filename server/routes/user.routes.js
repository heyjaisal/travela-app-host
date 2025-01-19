const express = require('express');

const {addProperty, eventproperty, updateprofile, getHost,uploadImage, getEvents, getHouse} = require('../controllers/create.controller');

const upload = require('../middleware/multer');

const authorization = require('../middleware/authentication');

const router = express.Router();

router.post('/properties',authorization, addProperty);
router.post('/events',authorization,eventproperty)
router.put('/profile',authorization,updateprofile)
router.get('/profile',authorization,getHost)
router.get('/events',authorization,getEvents)
router.get('/house',authorization,getHouse)
router.post("/upload", upload.single("image"), uploadImage);


module.exports = router ;