const User = require('../models/User');

class UserController {
  static async list(req, res) {
    try {
      const { limit, offset } = req.query;
      const users = await User.getByTenant(
        req.tenant.id,
        parseInt(limit, 10) || 100,
        parseInt(offset, 10) || 0
      );

      res.json({ users, count: users.length });
    } catch (error) {
      console.error('List users error:', error);
      res.status(500).json({ error: 'Failed to retrieve users' });
    }
  }
}

module.exports = UserController;
