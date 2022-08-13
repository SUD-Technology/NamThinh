const express = require('express');
const router = express.Router();
const DiscountController = require('../controllers/DiscountController');

router.get('/', DiscountController.getDiscountList);

router.get('/:slug', DiscountController.getDetailDiscount);

module.exports = router;