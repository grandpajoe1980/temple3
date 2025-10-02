const express = require('express');
const router = express.Router();
const CalendarEventController = require('../controllers/calendarEventController');
const auth = require('../middleware/auth');
const { tenantMiddleware, requireTenant, validateTenantAccess } = require('../middleware/tenant');

// Apply middleware
router.use(tenantMiddleware);
router.use(requireTenant);
router.use(auth);
router.use(validateTenantAccess);

// Routes
router.post('/', CalendarEventController.create);
router.get('/', CalendarEventController.list);
router.get('/:id', CalendarEventController.getById);
router.put('/:id', CalendarEventController.update);
router.delete('/:id', CalendarEventController.delete);

module.exports = router;
