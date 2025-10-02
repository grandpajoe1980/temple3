const express = require('express');
const router = express.Router();
const PodcastController = require('../controllers/podcastController');
const auth = require('../middleware/auth');
const { tenantMiddleware, requireTenant, validateTenantAccess } = require('../middleware/tenant');

// Apply middleware
router.use(tenantMiddleware);
router.use(requireTenant);
router.use(auth);
router.use(validateTenantAccess);

// Routes
router.post('/', PodcastController.create);
router.get('/', PodcastController.list);
router.get('/:id', PodcastController.getById);
router.put('/:id', PodcastController.update);
router.delete('/:id', PodcastController.delete);

module.exports = router;
