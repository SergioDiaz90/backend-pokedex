const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const authenticationMiddleware = require('../middleware/auth-middleware');


router.post('/login', authController.login);
router.post('/logout', authenticationMiddleware.authenticateToken, authController.logout);

module.exports = router;