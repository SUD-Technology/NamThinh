const express = require('express');
const router = express.Router();
const CollectionController = require('../controllers/CollectionController');

router.post('/search', CollectionController.postFindProducts);
router.get('/search', CollectionController.getFindProducts);
router.get('/:slug', CollectionController.getACollection);
module.exports = router;