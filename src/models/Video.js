const pool = require('../config/database');

class Video {
  static async create({ tenantId, title, description, videoUrl, thumbnailUrl, duration, publishedAt, createdBy }) {
    const result = await pool.query(
      `INSERT INTO videos (tenant_id, title, description, video_url, thumbnail_url, duration, published_at, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [tenantId, title, description, videoUrl, thumbnailUrl, duration, publishedAt, createdBy]
    );
    
    return result.rows[0];
  }

  static async findById(id, tenantId) {
    const result = await pool.query(
      'SELECT * FROM videos WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    );
    
    return result.rows[0];
  }

  static async list(tenantId, { limit = 50, offset = 0 }) {
    const result = await pool.query(
      'SELECT * FROM videos WHERE tenant_id = $1 ORDER BY published_at DESC LIMIT $2 OFFSET $3',
      [tenantId, limit, offset]
    );
    
    return result.rows;
  }

  static async update(id, tenantId, updates) {
    const allowedFields = ['title', 'description', 'video_url', 'thumbnail_url', 'duration', 'published_at'];
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return null;
    }

    values.push(id, tenantId);

    const result = await pool.query(
      `UPDATE videos SET ${fields.join(', ')} WHERE id = $${paramCount} AND tenant_id = $${paramCount + 1} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id, tenantId) {
    const result = await pool.query(
      'DELETE FROM videos WHERE id = $1 AND tenant_id = $2 RETURNING id',
      [id, tenantId]
    );
    
    return result.rows[0];
  }
}

module.exports = Video;
