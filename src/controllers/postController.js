const Post = require('../models/Post');

class PostController {
  static createPostController(postType) {
    return {
      async create(req, res) {
        try {
          const { content, attachments, isPublished, publishedAt } = req.body;

          if (!content) {
            return res.status(400).json({ error: 'Content is required' });
          }

          const post = await Post.create({
            tenantId: req.tenant.id,
            authorId: req.user.userId,
            content,
            attachments,
            isPublished: isPublished || false,
            publishedAt: publishedAt || (isPublished ? new Date() : null),
            postType
          });

          res.status(201).json({
            message: 'Post created successfully',
            post
          });
        } catch (error) {
          console.error('Create post error:', error);
          res.status(500).json({ error: 'Failed to create post' });
        }
      },

      async list(req, res) {
        try {
          const { limit, offset, isPublished } = req.query;

          const posts = await Post.list(req.tenant.id, postType, {
            limit: parseInt(limit) || 50,
            offset: parseInt(offset) || 0,
            isPublished: isPublished === 'true' ? true : isPublished === 'false' ? false : undefined
          });

          res.json({ posts, count: posts.length });
        } catch (error) {
          console.error('List posts error:', error);
          res.status(500).json({ error: 'Failed to retrieve posts' });
        }
      },

      async getById(req, res) {
        try {
          const { id } = req.params;

          const post = await Post.findById(id, req.tenant.id, postType);

          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }

          res.json(post);
        } catch (error) {
          console.error('Get post error:', error);
          res.status(500).json({ error: 'Failed to retrieve post' });
        }
      },

      async update(req, res) {
        try {
          const { id } = req.params;
          const updates = req.body;

          const post = await Post.update(id, req.tenant.id, postType, updates);

          if (!post) {
            return res.status(404).json({ error: 'Post not found or no valid updates' });
          }

          res.json({
            message: 'Post updated successfully',
            post
          });
        } catch (error) {
          console.error('Update post error:', error);
          res.status(500).json({ error: 'Failed to update post' });
        }
      },

      async delete(req, res) {
        try {
          const { id } = req.params;

          const deleted = await Post.delete(id, req.tenant.id, postType);

          if (!deleted) {
            return res.status(404).json({ error: 'Post not found' });
          }

          res.json({ message: 'Post deleted successfully' });
        } catch (error) {
          console.error('Delete post error:', error);
          res.status(500).json({ error: 'Failed to delete post' });
        }
      },

      async getComments(req, res) {
        try {
          const { id } = req.params;

          const comments = await Post.getComments(id, req.tenant.id, postType);

          res.json({ comments, count: comments.length });
        } catch (error) {
          console.error('Get comments error:', error);
          res.status(500).json({ error: 'Failed to retrieve comments' });
        }
      },

      async addComment(req, res) {
        try {
          const { id } = req.params;
          const { content } = req.body;

          if (!content) {
            return res.status(400).json({ error: 'Content is required' });
          }

          const comment = await Post.addComment(
            id,
            req.tenant.id,
            postType,
            req.user.userId,
            content
          );

          res.status(201).json({
            message: 'Comment added successfully',
            comment
          });
        } catch (error) {
          console.error('Add comment error:', error);
          res.status(500).json({ error: 'Failed to add comment' });
        }
      }
    };
  }
}

module.exports = PostController;
