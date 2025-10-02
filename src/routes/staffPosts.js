const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');
const auth = require('../middleware/auth');
const { tenantMiddleware, requireTenant, validateTenantAccess } = require('../middleware/tenant');

// Create staff post controller
const staffPostController = PostController.createPostController('staff');

// Apply middleware
router.use(tenantMiddleware);
router.use(requireTenant);
router.use(auth);
router.use(validateTenantAccess);

// Routes
router.post('/', staffPostController.create);
router.get('/', staffPostController.list);
router.get('/:id', staffPostController.getById);
router.put('/:id', staffPostController.update);
router.delete('/:id', staffPostController.delete);
router.get('/:id/comments', staffPostController.getComments);
router.post('/:id/comments', staffPostController.addComment);

module.exports = router;
