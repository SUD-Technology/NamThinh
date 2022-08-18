const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/NewsController');

router.get('/', NewsController.getPostList);
router.get('/group/:slug', NewsController.getGroupNews);

router.get('/:slug', NewsController.getDetailPost);

module.exports = router;