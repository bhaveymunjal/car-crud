const express = require('express');
const carController = require('../controller/vehicle.controller.js');
const auth = require('../config/middleware');
const router = express.Router();
const multer = require('multer');
const upload = multer().array('files', 10);

router.post('/cars', auth, upload, carController.createCar)
router.get('/cars', auth, carController.getCars);
router.get('/car/:id', auth, carController.getCar);
router.put('/car/:id', auth, upload, carController.updateCar);
router.delete('/car/:id',auth, carController.deleteCar);

module.exports = router;
