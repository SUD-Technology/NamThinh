const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

router.get('/:slug', ProductController.getProductDetail);

module.exports = router;