const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/messageController');
const auth = require('../middleware/auth');
const { tenantMiddleware, requireTenant, validateTenantAccess } = require('../middleware/tenant');

// Apply middleware
router.use(tenantMiddleware);
router.use(requireTenant);
router.use(auth);
router.use(validateTenantAccess);

// Routes
router.post('/', MessageController.send);
router.get('/inbox', MessageController.getInbox);
router.get('/sent', MessageController.getSent);
router.get('/:id', MessageController.getById);
router.put('/:id/read', MessageController.markAsRead);

module.exports = router;
