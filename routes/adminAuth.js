const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/login', adminController.getAdminLogin);

router.post('/login', adminController.postAdminLogin);

module.exports = router;