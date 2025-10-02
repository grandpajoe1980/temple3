const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { tenantMiddleware, requireTenant } = require('../middleware/tenant');

// Apply tenant middleware to all routes
router.use(tenantMiddleware);

// Public routes (with tenant context)
router.post('/register', requireTenant, AuthController.register);
router.post('/login', requireTenant, AuthController.login);

// Protected routes
router.get('/me', auth, AuthController.getCurrentUser);

module.exports = router;
