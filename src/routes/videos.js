const express = require('express');
const router = express.Router();
const VideoController = require('../controllers/videoController');
const auth = require('../middleware/auth');
const { tenantMiddleware, requireTenant, validateTenantAccess } = require('../middleware/tenant');

// Apply middleware
router.use(tenantMiddleware);
router.use(requireTenant);
router.use(auth);
router.use(validateTenantAccess);

// Routes
router.post('/', VideoController.create);
router.get('/', VideoController.list);
router.get('/:id', VideoController.getById);
router.put('/:id', VideoController.update);
router.delete('/:id', VideoController.delete);

module.exports = router;
