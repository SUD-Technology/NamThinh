const express = require('express');
const router = express.Router();
const CollectionController = require('../controllers/CollectionController');

router.get('/:slug', CollectionController.getACollection);
module.exports = router;