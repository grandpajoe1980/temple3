const Video = require('../models/Video');

class VideoController {
  static async create(req, res) {
    try {
      const { title, description, videoUrl, thumbnailUrl, duration, publishedAt } = req.body;

      if (!title || !videoUrl) {
        return res.status(400).json({ error: 'Title and video URL are required' });
      }

      const video = await Video.create({
        tenantId: req.tenant.id,
        title,
        description,
        videoUrl,
        thumbnailUrl,
        duration,
        publishedAt: publishedAt || new Date(),
        createdBy: req.user.userId
      });

      res.status(201).json({
        message: 'Video created successfully',
        video
      });
    } catch (error) {
      console.error('Create video error:', error);
      res.status(500).json({ error: 'Failed to create video' });
    }
  }

  static async list(req, res) {
    try {
      const { limit, offset } = req.query;

      const videos = await Video.list(req.tenant.id, {
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0
      });

      res.json({ videos, count: videos.length });
    } catch (error) {
      console.error('List videos error:', error);
      res.status(500).json({ error: 'Failed to retrieve videos' });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const video = await Video.findById(id, req.tenant.id);

      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      res.json(video);
    } catch (error) {
      console.error('Get video error:', error);
      res.status(500).json({ error: 'Failed to retrieve video' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const video = await Video.update(id, req.tenant.id, updates);

      if (!video) {
        return res.status(404).json({ error: 'Video not found or no valid updates' });
      }

      res.json({
        message: 'Video updated successfully',
        video
      });
    } catch (error) {
      console.error('Update video error:', error);
      res.status(500).json({ error: 'Failed to update video' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Video.delete(id, req.tenant.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Video not found' });
      }

      res.json({ message: 'Video deleted successfully' });
    } catch (error) {
      console.error('Delete video error:', error);
      res.status(500).json({ error: 'Failed to delete video' });
    }
  }
}

module.exports = VideoController;
