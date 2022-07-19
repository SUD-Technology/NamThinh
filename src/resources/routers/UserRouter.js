const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const loginValidator = require('../validators/loginValidator')

router.get('/login', UserController.getLogin);

router.post('/login', UserController.postLogin);

router.get('/register', loginValidator, UserController.register);

router.get('/logout', UserController.getLogout)
module.exports = router;