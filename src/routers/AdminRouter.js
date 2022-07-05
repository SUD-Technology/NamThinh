const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('admin')
})

router.get('/add-product', (req, res) => {
    res.render('addProduct', { index: true })
})

module.exports = router;