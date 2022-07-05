const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('admin', { admin: true })
})

router.get('/add-product', (req, res) => {
    res.render('addProduct', { admin: true })
})

router.get('/edit', (req, res) => {
    res.render('editPage', { admin: true })
})

router.get('/changePassword', (req, res) => {
    res.render('changePassword', { admin: true })
})
module.exports = router;