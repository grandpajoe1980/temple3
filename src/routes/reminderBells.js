const express = require('express');
const router = express.Router();
const ReminderBellController = require('../controllers/reminderBellController');
const auth = require('../middleware/auth');
const { tenantMiddleware, requireTenant, validateTenantAccess } = require('../middleware/tenant');

// Apply middleware
router.use(tenantMiddleware);
router.use(requireTenant);
router.use(auth);
router.use(validateTenantAccess);

// Routes
router.post('/', ReminderBellController.create);
router.get('/', ReminderBellController.list);
router.get('/:id', ReminderBellController.getById);
router.put('/:id', ReminderBellController.update);
router.delete('/:id', ReminderBellController.delete);

module.exports = router;
