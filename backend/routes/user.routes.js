const express = require('express');
const userController = require('../controller/user.controller.js');
const router = express.Router();
const auth = require('../config/middleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/profile', auth, userController.profile);

module.exports = router;
