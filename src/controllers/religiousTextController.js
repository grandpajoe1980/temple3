const ReligiousText = require('../models/ReligiousText');

class ReligiousTextController {
  static async create(req, res) {
    try {
      const { title, content, author, category, tags, isPublic } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const text = await ReligiousText.create({
        tenantId: req.tenant.id,
        title,
        content,
        author,
        category,
        tags: tags || [],
        isPublic: isPublic || false,
        createdBy: req.user.userId
      });

      res.status(201).json({
        message: 'Religious text created successfully',
        text
      });
    } catch (error) {
      console.error('Create religious text error:', error);
      res.status(500).json({ error: 'Failed to create religious text' });
    }
  }

  static async list(req, res) {
    try {
      const { limit, offset, category, isPublic } = req.query;

      const texts = await ReligiousText.list(req.tenant.id, {
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0,
        category,
        isPublic: isPublic === 'true' ? true : isPublic === 'false' ? false : undefined
      });

      res.json({ texts, count: texts.length });
    } catch (error) {
      console.error('List religious texts error:', error);
      res.status(500).json({ error: 'Failed to retrieve religious texts' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      const text = await ReligiousText.findById(id, req.tenant.id);

      if (!text) {
        return res.status(404).json({ error: 'Religious text not found' });
      }

      res.json(text);
    } catch (error) {
      console.error('Get religious text error:', error);
      res.status(500).json({ error: 'Failed to retrieve religious text' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const text = await ReligiousText.update(id, req.tenant.id, updates);

      if (!text) {
        return res.status(404).json({ error: 'Religious text not found or no valid updates' });
      }

      res.json({
        message: 'Religious text updated successfully',
        text
      });
    } catch (error) {
      console.error('Update religious text error:', error);
      res.status(500).json({ error: 'Failed to update religious text' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await ReligiousText.delete(id, req.tenant.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Religious text not found' });
      }

      res.json({ message: 'Religious text deleted successfully' });
    } catch (error) {
      console.error('Delete religious text error:', error);
      res.status(500).json({ error: 'Failed to delete religious text' });
    }
  }
}

module.exports = ReligiousTextController;
