const pool = require('../config/database');

class Podcast {
  static async create({ tenantId, title, description, audioUrl, duration, episodeNumber, seasonNumber, publishedAt, createdBy }) {
    const result = await pool.query(
      `INSERT INTO podcasts (tenant_id, title, description, audio_url, duration, episode_number, season_number, published_at, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [tenantId, title, description, audioUrl, duration, episodeNumber, seasonNumber, publishedAt, createdBy]
    );
    
    return result.rows[0];
  }

  static async findById(id, tenantId) {
    const result = await pool.query(
      'SELECT * FROM podcasts WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    );
    
    return result.rows[0];
  }

  static async list(tenantId, { limit = 50, offset = 0, seasonNumber }) {
    let query = 'SELECT * FROM podcasts WHERE tenant_id = $1';
    const params = [tenantId];
    let paramCount = 2;

    if (seasonNumber) {
      query += ` AND season_number = $${paramCount}`;
      params.push(seasonNumber);
      paramCount++;
    }

    query += ` ORDER BY published_at DESC, episode_number DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async update(id, tenantId, updates) {
    const allowedFields = ['title', 'description', 'audio_url', 'duration', 'episode_number', 'season_number', 'published_at'];
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
      `UPDATE podcasts SET ${fields.join(', ')} WHERE id = $${paramCount} AND tenant_id = $${paramCount + 1} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id, tenantId) {
    const result = await pool.query(
      'DELETE FROM podcasts WHERE id = $1 AND tenant_id = $2 RETURNING id',
      [id, tenantId]
    );
    
    return result.rows[0];
  }
}

module.exports = Podcast;
