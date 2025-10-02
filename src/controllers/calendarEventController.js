const CalendarEvent = require('../models/CalendarEvent');

class CalendarEventController {
  static async create(req, res) {
    try {
      const { title, description, startTime, endTime, location, eventType, isRecurring, recurrenceRule } = req.body;

      if (!title || !startTime || !endTime) {
        return res.status(400).json({ error: 'Title, start time, and end time are required' });
      }

      const event = await CalendarEvent.create({
        tenantId: req.tenant.id,
        title,
        description,
        startTime,
        endTime,
        location,
        eventType,
        isRecurring: isRecurring || false,
        recurrenceRule,
        createdBy: req.user.userId
      });

      res.status(201).json({
        message: 'Calendar event created successfully',
        event
      });
    } catch (error) {
      console.error('Create calendar event error:', error);
      res.status(500).json({ error: 'Failed to create calendar event' });
    }
  }

  static async list(req, res) {
    try {
      const { limit, offset, startDate, endDate, eventType } = req.query;

      const events = await CalendarEvent.list(req.tenant.id, {
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0,
        startDate,
        endDate,
        eventType
      });

      res.json({ events, count: events.length });
    } catch (error) {
      console.error('List calendar events error:', error);
      res.status(500).json({ error: 'Failed to retrieve calendar events' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      const event = await CalendarEvent.findById(id, req.tenant.id);

      if (!event) {
        return res.status(404).json({ error: 'Calendar event not found' });
      }

      res.json(event);
    } catch (error) {
      console.error('Get calendar event error:', error);
      res.status(500).json({ error: 'Failed to retrieve calendar event' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const event = await CalendarEvent.update(id, req.tenant.id, updates);

      if (!event) {
        return res.status(404).json({ error: 'Calendar event not found or no valid updates' });
      }

      res.json({
        message: 'Calendar event updated successfully',
        event
      });
    } catch (error) {
      console.error('Update calendar event error:', error);
      res.status(500).json({ error: 'Failed to update calendar event' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await CalendarEvent.delete(id, req.tenant.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Calendar event not found' });
      }

      res.json({ message: 'Calendar event deleted successfully' });
    } catch (error) {
      console.error('Delete calendar event error:', error);
      res.status(500).json({ error: 'Failed to delete calendar event' });
    }
  }
}

module.exports = CalendarEventController;
