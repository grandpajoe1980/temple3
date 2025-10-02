const pool = require('../config/database');

class Post {
  static async create({ tenantId, authorId, content, attachments, isPublished, publishedAt, postType }) {
    const table = postType === 'staff' ? 'staff_posts' : 'layperson_posts';
    
    const result = await pool.query(
      `INSERT INTO ${table} (tenant_id, author_id, content, attachments, is_published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [tenantId, authorId, content, JSON.stringify(attachments || []), isPublished, publishedAt]
    );
    
    return result.rows[0];
  }

  static async findById(id, tenantId, postType) {
    const table = postType === 'staff' ? 'staff_posts' : 'layperson_posts';
    
    const result = await pool.query(
      `SELECT p.*, u.first_name, u.last_name, u.email
       FROM ${table} p
       LEFT JOIN users u ON p.author_id = u.id
       WHERE p.id = $1 AND p.tenant_id = $2`,
      [id, tenantId]
    );
    
    return result.rows[0];
  }

  static async list(tenantId, postType, { limit = 50, offset = 0, isPublished }) {
    const table = postType === 'staff' ? 'staff_posts' : 'layperson_posts';
    
    let query = `SELECT p.*, u.first_name, u.last_name
                 FROM ${table} p
                 LEFT JOIN users u ON p.author_id = u.id
                 WHERE p.tenant_id = $1`;
    const params = [tenantId];
    let paramCount = 2;

    if (isPublished !== undefined) {
      query += ` AND p.is_published = $${paramCount}`;
      params.push(isPublished);
      paramCount++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async update(id, tenantId, postType, updates) {
    const table = postType === 'staff' ? 'staff_posts' : 'layperson_posts';
    const allowedFields = ['content', 'attachments', 'is_published', 'published_at'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        const value = key === 'attachments' ? JSON.stringify(updates[key]) : updates[key];
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return null;
    }

    values.push(id, tenantId);

    const result = await pool.query(
      `UPDATE ${table} SET ${fields.join(', ')} WHERE id = $${paramCount} AND tenant_id = $${paramCount + 1} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id, tenantId, postType) {
    const table = postType === 'staff' ? 'staff_posts' : 'layperson_posts';
    
    const result = await pool.query(
      `DELETE FROM ${table} WHERE id = $1 AND tenant_id = $2 RETURNING id`,
      [id, tenantId]
    );
    
    return result.rows[0];
  }

  static async getComments(postId, tenantId, postType) {
    const result = await pool.query(
      `SELECT c.*, u.first_name, u.last_name
       FROM comments c
       LEFT JOIN users u ON c.author_id = u.id
       WHERE c.post_id = $1 AND c.tenant_id = $2 AND c.post_type = $3
       ORDER BY c.created_at ASC`,
      [postId, tenantId, postType]
    );
    
    return result.rows;
  }

  static async addComment(postId, tenantId, postType, authorId, content) {
    const result = await pool.query(
      `INSERT INTO comments (tenant_id, post_type, post_id, author_id, content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tenantId, postType, postId, authorId, content]
    );
    
    return result.rows[0];
  }
}

module.exports = Post;
