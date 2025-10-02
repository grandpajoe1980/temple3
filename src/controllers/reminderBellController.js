const ReminderBell = require('../models/ReminderBell');

class ReminderBellController {
  static async create(req, res) {
    try {
      const { title, reminderTime, daysOfWeek, isActive } = req.body;

      if (!title || !reminderTime) {
        return res.status(400).json({ error: 'Title and reminder time are required' });
      }

      const bell = await ReminderBell.create({
        tenantId: req.tenant.id,
        userId: req.user.userId,
        title,
        reminderTime,
        daysOfWeek: daysOfWeek || [0, 1, 2, 3, 4, 5, 6], // All days by default
        isActive
      });

      res.status(201).json({
        message: 'Reminder bell created successfully',
        bell
      });
    } catch (error) {
      console.error('Create reminder bell error:', error);
      res.status(500).json({ error: 'Failed to create reminder bell' });
    }
  }

  static async list(req, res) {
    try {
      const { limit, offset } = req.query;

      const bells = await ReminderBell.list(req.tenant.id, req.user.userId, {
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0
      });

      res.json({ bells, count: bells.length });
    } catch (error) {
      console.error('List reminder bells error:', error);
      res.status(500).json({ error: 'Failed to retrieve reminder bells' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      const bell = await ReminderBell.findById(id, req.tenant.id, req.user.userId);

      if (!bell) {
        return res.status(404).json({ error: 'Reminder bell not found' });
      }

      res.json(bell);
    } catch (error) {
      console.error('Get reminder bell error:', error);
      res.status(500).json({ error: 'Failed to retrieve reminder bell' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const bell = await ReminderBell.update(id, req.tenant.id, req.user.userId, updates);

      if (!bell) {
        return res.status(404).json({ error: 'Reminder bell not found or no valid updates' });
      }

      res.json({
        message: 'Reminder bell updated successfully',
        bell
      });
    } catch (error) {
      console.error('Update reminder bell error:', error);
      res.status(500).json({ error: 'Failed to update reminder bell' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await ReminderBell.delete(id, req.tenant.id, req.user.userId);

      if (!deleted) {
        return res.status(404).json({ error: 'Reminder bell not found' });
      }

      res.json({ message: 'Reminder bell deleted successfully' });
    } catch (error) {
      console.error('Delete reminder bell error:', error);
      res.status(500).json({ error: 'Failed to delete reminder bell' });
    }
  }
}

module.exports = ReminderBellController;
