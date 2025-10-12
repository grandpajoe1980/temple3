const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { tenantMiddleware, requireTenant, validateTenantAccess } = require('../middleware/tenant');

router.use(tenantMiddleware);
router.use(requireTenant);
router.use(auth);
router.use(validateTenantAccess);

router.get('/', UserController.list);

module.exports = router;
