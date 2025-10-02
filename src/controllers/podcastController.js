const Podcast = require('../models/Podcast');

class PodcastController {
  static async create(req, res) {
    try {
      const { title, description, audioUrl, duration, episodeNumber, seasonNumber, publishedAt } = req.body;

      if (!title || !audioUrl) {
        return res.status(400).json({ error: 'Title and audio URL are required' });
      }

      const podcast = await Podcast.create({
        tenantId: req.tenant.id,
        title,
        description,
        audioUrl,
        duration,
        episodeNumber,
        seasonNumber,
        publishedAt: publishedAt || new Date(),
        createdBy: req.user.userId
      });

      res.status(201).json({
        message: 'Podcast created successfully',
        podcast
      });
    } catch (error) {
      console.error('Create podcast error:', error);
      res.status(500).json({ error: 'Failed to create podcast' });
    }
  }

  static async list(req, res) {
    try {
      const { limit, offset, seasonNumber } = req.query;

      const podcasts = await Podcast.list(req.tenant.id, {
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0,
        seasonNumber: seasonNumber ? parseInt(seasonNumber) : undefined
      });

      res.json({ podcasts, count: podcasts.length });
    } catch (error) {
      console.error('List podcasts error:', error);
      res.status(500).json({ error: 'Failed to retrieve podcasts' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const podcast = await Podcast.findById(id, req.tenant.id);

      if (!podcast) {
        return res.status(404).json({ error: 'Podcast not found' });
      }

      res.json(podcast);
    } catch (error) {
      console.error('Get podcast error:', error);
      res.status(500).json({ error: 'Failed to retrieve podcast' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const podcast = await Podcast.update(id, req.tenant.id, updates);

      if (!podcast) {
        return res.status(404).json({ error: 'Podcast not found or no valid updates' });
      }

      res.json({
        message: 'Podcast updated successfully',
        podcast
      });
    } catch (error) {
      console.error('Update podcast error:', error);
      res.status(500).json({ error: 'Failed to update podcast' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Podcast.delete(id, req.tenant.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Podcast not found' });
      }

      res.json({ message: 'Podcast deleted successfully' });
    } catch (error) {
      console.error('Delete podcast error:', error);
      res.status(500).json({ error: 'Failed to delete podcast' });
    }
  }
}

module.exports = PodcastController;
