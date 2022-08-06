const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/NewsController');

// router.get('/:slug', NewsController.getACollection);
router.get('/', (req, res, next) => {
    return res.render('news');
})

module.exports = router;