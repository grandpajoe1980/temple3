const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');
const auth = require('../middleware/auth');
const { tenantMiddleware, requireTenant, validateTenantAccess } = require('../middleware/tenant');

// Create layperson post controller
const laypersonPostController = PostController.createPostController('layperson');

// Apply middleware
router.use(tenantMiddleware);
router.use(requireTenant);
router.use(auth);
router.use(validateTenantAccess);

// Routes
router.post('/', laypersonPostController.create);
router.get('/', laypersonPostController.list);
router.get('/:id', laypersonPostController.getById);
router.put('/:id', laypersonPostController.update);
router.delete('/:id', laypersonPostController.delete);
router.get('/:id/comments', laypersonPostController.getComments);
router.post('/:id/comments', laypersonPostController.addComment);

module.exports = router;
