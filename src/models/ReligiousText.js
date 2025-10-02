const pool = require('../config/database');

class ReligiousText {
  static async create({ tenantId, title, content, author, category, tags, isPublic, createdBy }) {
    const result = await pool.query(
      `INSERT INTO religious_texts (tenant_id, title, content, author, category, tags, is_public, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [tenantId, title, content, author, category, tags, isPublic, createdBy]
    );
    
    return result.rows[0];
  }

  static async findById(id, tenantId) {
    const result = await pool.query(
      'SELECT * FROM religious_texts WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    );
    
    return result.rows[0];
  }

  static async list(tenantId, { limit = 50, offset = 0, category, isPublic }) {
    let query = 'SELECT * FROM religious_texts WHERE tenant_id = $1';
    const params = [tenantId];
    let paramCount = 2;

    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (isPublic !== undefined) {
      query += ` AND is_public = $${paramCount}`;
      params.push(isPublic);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async update(id, tenantId, updates) {
    const allowedFields = ['title', 'content', 'author', 'category', 'tags', 'is_public'];
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
      `UPDATE religious_texts SET ${fields.join(', ')} WHERE id = $${paramCount} AND tenant_id = $${paramCount + 1} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id, tenantId) {
    const result = await pool.query(
      'DELETE FROM religious_texts WHERE id = $1 AND tenant_id = $2 RETURNING id',
      [id, tenantId]
    );
    
    return result.rows[0];
  }
}

module.exports = ReligiousText;
