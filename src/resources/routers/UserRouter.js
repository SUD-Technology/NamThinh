const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const loginValidator = require('../validators/loginValidator');
const registerValidator = require('../validators/registerValidator')

router.get('/login', UserController.getLogin);

router.post('/login', UserController.postLogin);

router.get('/register', UserController.getRegister);
router.post('/register', registerValidator, UserController.postRegister)

router.get('/logout', UserController.getLogout)
module.exports = router;