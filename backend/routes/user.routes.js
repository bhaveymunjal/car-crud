const express = require('express');
const userController = require('../controller/user.controller.js');
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;
