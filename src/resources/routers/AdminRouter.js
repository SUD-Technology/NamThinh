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

router.get('/product-manager', checkLogin, authPage(["admin", "accountant"]), AdminController.getProductManager)

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
router.get('/add-news', checkLogin, authPage(["admin"]), AdminController.getAddNews)
router.post('/add-news', checkLogin, authPage(["admin"]), store.single('news-image'), AdminController.postANews)
router.get('/listNews', checkLogin, authPage(["admin"]), AdminController.getPosts)
router.get('/deleteNews/:id', checkLogin, authPage(["admin"]), AdminController.deletePosts)
router.get('/updateNews/:id', AdminController.getUpdatePost)
// Discount
router.get('/add-discount', checkLogin, authPage(["admin"]), AdminController.getAddDiscount)
router.post('/add-discount', store.single('discount-image'), AdminController.postAddDiscount)
router.get('/listDiscounts', checkLogin, authPage(["admin"]), AdminController.getDiscounts)
router.get('/deleteDiscount/:id', checkLogin, authPage(["admin"]), AdminController.deleteDiscount)
router.get('/updateDiscount/:id', AdminController.getUpdateDiscount)
router.post('/updateDiscountById', store.single('discount-image'), AdminController.postUpdateDiscount)
// Services
router.get('/add-services', checkLogin, authPage(["admin"]), AdminController.getAddServices)
router.post('/add-services', store.single('services-image'), AdminController.postAddServices)
router.get('/listServices', checkLogin, authPage(["admin"]), AdminController.getServices)
router.get('/deleteService/:id', checkLogin, authPage(["admin"]), AdminController.deleteService)

// Create order
router.get('/create-order', checkLogin, authPage(['admin', "sale"]), AdminController.getCreateOrder)
router.post('/create-order', checkLogin, authPage(['admin', "sale"]), AdminController.postCreateOrder)
router.get('/getOrders', checkLogin, authPage(['admin', "sale"]), AdminController.getOrders)
router.post('/getOrders', checkLogin, authPage(['admin', "sale"]), AdminController.postEditStatus)


router.get('/history', checkLogin, authPage(["admin"]), AdminController.getHistory);
router.post('/getOrders/finish', checkLogin, authPage(["admin"]), AdminController.finishOrder);
// Get sale
router.get('/getUsers', checkLogin, authPage(['admin']), AdminController.getUsers)
router.get('/deleteUser/:id', checkLogin, authPage(['admin']), AdminController.deleteUser)

// About
router.get('/add-about', checkLogin, authPage(["admin"]), AdminController.getAddAbout);
router.post('/add-about', checkLogin, authPage(["admin"]), AdminController.postAddAbout);

router.use('/', (req, res) => {
    res.redirect('/users/login');
})


module.exports = router;

