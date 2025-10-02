const express = require('express');
const router = express.Router();
const TenantController = require('../controllers/tenantController');
const auth = require('../middleware/auth');
const { tenantMiddleware, requireTenant, validateTenantAccess } = require('../middleware/tenant');

// Public route to create a new tenant
router.post('/', TenantController.create);

// Protected routes (require tenant context and authentication)
router.use(tenantMiddleware);
router.use(requireTenant);
router.use(auth);
router.use(validateTenantAccess);

router.get('/', TenantController.getTenant);
router.put('/', TenantController.updateTenant);

module.exports = router;
