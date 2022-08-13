const express = require('express');
const router = express.Router();
const ServicesController = require('../controllers/ServicesController');

router.get('/', ServicesController.getServicesList);

router.get('/:slug', ServicesController.getDetailServices);

module.exports = router;