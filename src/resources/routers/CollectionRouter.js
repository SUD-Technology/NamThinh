const express = require('express');
const router = express.Router();
const CollectionController = require('../controllers/CollectionController');

router.get('/:slug', CollectionController.getACollection);
router.get('/search/:keyword', CollectionController.getFindProducts);
router.post('/search', CollectionController.postFindProducts);
module.exports = router;