const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const loginValidator = require('../validators/loginValidator');
const registerValidator = require('../validators/registerValidator')
const { authPage } = require('../auth/checkUser')


router.get('/login', UserController.getLogin);

router.post('/login', loginValidator, UserController.postLogin);

router.get('/register', authPage(["admin"]), UserController.getRegister);
router.post('/register', registerValidator, UserController.postRegister)

router.get('/changePassword', UserController.getChangePassword)
router.post('/changePassword', UserController.postChangePassword)
router.post('/reOrder', UserController.postReorder)
router.get('/logout', UserController.getLogout)
module.exports = router;