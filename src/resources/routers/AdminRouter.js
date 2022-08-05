const express = require('express');
const router = express.Router();

// Controller
const AdminController = require('../controllers/AdminController')
// middleware
const { uploadImage } = require('../services/firebase');
const store = require('../middlewares/multer');
const checkLogin = require('../auth/checkLogin')
const { authPage } = require('../auth/checkUser')

router.get('/adminHome', (req, res) => {
    res.render('admin', { layout: 'admin', position: req.session.position })
})

router.get('/contact', (req, res) => {
    res.render('contact', { position: req.session.position, change: false })
})

router.get('/product-manager', AdminController.getProductManager)


router.get('/edit', (req, res) => {
    res.render('editPage', { position: req.session.position })
})

router.get('/changePassword', checkLogin, (req, res) => {
    res.render('changePassword', { position: req.session.position })
})

router.get('/customer-info', checkLogin, authPage(["admin", "sale"]), (req, res) => {
    res.render('customerInfo', { position: req.session.position })
})


router.get('/add-product', checkLogin, authPage(["admin", "accountant"]), AdminController.getAddProduct)
router.post('/add-product', store.array('product-image', 12), uploadImage, AdminController.addProduct)
router.get('/delete/:id', AdminController.deleteProduct)

// News
router.get('/add-news', AdminController.getAddNews)


router.get('/create-order', checkLogin, authPage(['admin', "sale"]), AdminController.getCreateOrder)
router.post('/create-order', AdminController.postCreateOrder)
module.exports = router;