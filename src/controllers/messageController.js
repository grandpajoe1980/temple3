const Message = require('../models/Message');

class MessageController {
  static async send(req, res) {
    try {
      const { recipientId, subject, content } = req.body;

      if (!subject || !content) {
        return res.status(400).json({ error: 'Subject and content are required' });
      }

      const message = await Message.create({
        tenantId: req.tenant.id,
        senderId: req.user.userId,
        recipientId,
        subject,
        content
      });

      res.status(201).json({
        message: 'Message sent successfully',
        data: message
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }

  static async getInbox(req, res) {
    try {
      const { limit, offset } = req.query;

      const messages = await Message.getInbox(req.tenant.id, req.user.userId, {
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0
      });

      res.json({ messages, count: messages.length });
    } catch (error) {
      console.error('Get inbox error:', error);
      res.status(500).json({ error: 'Failed to retrieve inbox' });
    }
  }

  static async getSent(req, res) {
    try {
      const { limit, offset } = req.query;

      const messages = await Message.getSent(req.tenant.id, req.user.userId, {
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0
      });

      res.json({ messages, count: messages.length });
    } catch (error) {
      console.error('Get sent messages error:', error);
      res.status(500).json({ error: 'Failed to retrieve sent messages' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      const message = await Message.findById(id, req.tenant.id);

      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }

      // Ensure user is sender or recipient
      if (message.sender_id !== req.user.userId && message.recipient_id !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(message);
    } catch (error) {
      console.error('Get message error:', error);
      res.status(500).json({ error: 'Failed to retrieve message' });
    }
  }

  static async markAsRead(req, res) {
    try {
      const { id } = req.params;

      const message = await Message.markAsRead(id, req.tenant.id, req.user.userId);

      if (!message) {
        return res.status(404).json({ error: 'Message not found or access denied' });
      }

      res.json({
        message: 'Message marked as read',
        data: message
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ error: 'Failed to mark message as read' });
    }
  }
}

module.exports = MessageController;
