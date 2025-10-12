const express = require('express');
const router = express.Router();
const TenantController = require('../controllers/tenantController');
const auth = require('../middleware/auth');
const { tenantMiddleware, requireTenant, validateTenantAccess } = require('../middleware/tenant');

// Public routes
router.get('/discover', TenantController.searchTenants);
router.get('/lookup/:subdomain', TenantController.getTenantBySubdomain);
router.post('/', TenantController.create);

// Protected routes (require tenant context and authentication)
router.use(tenantMiddleware);
router.use(requireTenant);
router.use(auth);
router.use(validateTenantAccess);

router.get('/current', TenantController.getCurrentTenant);
router.put('/current', TenantController.updateTenant);

module.exports = router;
