const express = require('express');
const router = express.Router();

// Controller
const AdminController = require('../controllers/AdminController')
// middleware
const { uploadImage } = require('../services/firebase');
const store = require('../middlewares/multer');
const checkLogin = require('../auth/checkLogin')
const { authPage } = require('../auth/checkUser')



// Home
router.get('/home', checkLogin, (req, res) => {
    res.render('admin', { layout: 'admin', position: req.session.position, pageName: "Trang chủ" })
})

router.get('/product-manager', checkLogin, authPage(["admin", "accountant", "sale"]), AdminController.getProductManager)

// Change Password
router.get('/changePassword', checkLogin, (req, res) => {
    res.render('changePassword', { position: req.session.position })
})

// Customer information
router.get('/customer-info', checkLogin, authPage(["admin", "sale"]), AdminController.getCustomers)

// Add Product
router.get('/add-product', checkLogin, authPage(["admin", "accountant"]), AdminController.getAddProduct)
router.post('/add-product', store.array('product-image', 12), uploadImage, AdminController.addProduct)

// Delete Product
router.get('/delete/:id', checkLogin, authPage(["admin", "accountant"]), AdminController.deleteProduct)

// News
router.get('/add-news', authPage(["admin"]), AdminController.getAddNews)
router.post('/add-news', authPage(["admin"]), store.single('news-image'), AdminController.postANews)

// Create order
router.get('/create-order', checkLogin, authPage(['admin', "sale"]), AdminController.getCreateOrder)
router.post('/create-order', AdminController.postCreateOrder)
router.get('/getOrders', AdminController.getOrders)
router.post('/getOrders', AdminController.postEditStatus)
router.get('/history', AdminController.getHistory);
router.post('/getOrders/finish', AdminController.finishOrder);
// Get sale
router.get('/getUsers', checkLogin, authPage(['admin']), AdminController.getUsers)
router.get('/deleteUser/:id', checkLogin, authPage(['admin']), AdminController.deleteUser)

router.use('/', (req, res) => {
    res.redirect('/users/login');
})


module.exports = router;

