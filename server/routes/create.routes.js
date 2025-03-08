const express = require('express');
const { handleRequest, getItems, uploadImage, deleteImage } = require('../controllers/create.controller');
const authorization = require('../middleware/authentication');
const upload = require('../middleware/multer')

const router = express.Router();

router.post('/add', authorization, handleRequest);
router.get('/items', authorization, getItems);
router.post('/upload',authorization, upload.single('image'), uploadImage);
router.delete('/delete',authorization, deleteImage);

module.exports = router;
