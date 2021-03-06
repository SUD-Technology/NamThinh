const express = require('express');
const router = express.Router();

// Controller
const AdminController = require('../controllers/AdminController')
// middleware
const uploadImage = require('../services/firebase');
const store = require('../middlewares/multer');
const checkLogin = require('../auth/checkLogin')

router.get('/', (req, res) => {
    res.render('home', { admin: true })
})

router.get('/contact', (req, res) => {
    res.render('contact', { admin: true, change: false })
})


router.get('/product-manager', AdminController.getProductManager)


router.get('/edit', (req, res) => {
    res.render('editPage', { admin: true })
})

router.get('/changePassword', (req, res) => {
    res.render('changePassword', { admin: true })
})

router.get('/customer-info', (req, res) => {
    res.render('customerInfo', { admin: true })
})


router.get('/add-product', (req, res) => {
    res.render('addProduct', { admin: true })
})
router.post('/add-product', store.array('product-image', 12), uploadImage, AdminController.addProduct)
router.get('/delete/:id', AdminController.deleteProduct)


module.exports = router;