const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/login',  UserController.getLogin);
// router.post('/login', UserController.postLogin);

module.exports = router;