const express = require('express');
const router = express.Router();
const ReligiousTextController = require('../controllers/religiousTextController');
const auth = require('../middleware/auth');
const { tenantMiddleware, requireTenant, validateTenantAccess } = require('../middleware/tenant');

// Apply middleware
router.use(tenantMiddleware);
router.use(requireTenant);
router.use(auth);
router.use(validateTenantAccess);

// Routes
router.post('/', ReligiousTextController.create);
router.get('/', ReligiousTextController.list);
router.get('/:id', ReligiousTextController.getById);
router.put('/:id', ReligiousTextController.update);
router.delete('/:id', ReligiousTextController.delete);

module.exports = router;
