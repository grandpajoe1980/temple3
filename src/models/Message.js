const pool = require('../config/database');

class Message {
  static async create({ tenantId, senderId, recipientId, subject, content }) {
    const result = await pool.query(
      `INSERT INTO messages (tenant_id, sender_id, recipient_id, subject, content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tenantId, senderId, recipientId, subject, content]
    );
    
    return result.rows[0];
  }

  static async findById(id, tenantId) {
    const result = await pool.query(
      `SELECT m.*, 
        u1.first_name as sender_first_name, u1.last_name as sender_last_name,
        u2.first_name as recipient_first_name, u2.last_name as recipient_last_name
       FROM messages m
       LEFT JOIN users u1 ON m.sender_id = u1.id
       LEFT JOIN users u2 ON m.recipient_id = u2.id
       WHERE m.id = $1 AND m.tenant_id = $2`,
      [id, tenantId]
    );
    
    return result.rows[0];
  }

  static async getInbox(tenantId, userId, { limit = 50, offset = 0 }) {
    const result = await pool.query(
      `SELECT m.*, 
        u.first_name as sender_first_name, u.last_name as sender_last_name
       FROM messages m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.tenant_id = $1 AND m.recipient_id = $2
       ORDER BY m.created_at DESC
       LIMIT $3 OFFSET $4`,
      [tenantId, userId, limit, offset]
    );
    
    return result.rows;
  }

  static async getSent(tenantId, userId, { limit = 50, offset = 0 }) {
    const result = await pool.query(
      `SELECT m.*, 
        u.first_name as recipient_first_name, u.last_name as recipient_last_name
       FROM messages m
       LEFT JOIN users u ON m.recipient_id = u.id
       WHERE m.tenant_id = $1 AND m.sender_id = $2
       ORDER BY m.created_at DESC
       LIMIT $3 OFFSET $4`,
      [tenantId, userId, limit, offset]
    );
    
    return result.rows;
  }

  static async markAsRead(id, tenantId, userId) {
    const result = await pool.query(
      `UPDATE messages 
       SET is_read = true, read_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND tenant_id = $2 AND recipient_id = $3
       RETURNING *`,
      [id, tenantId, userId]
    );
    
    return result.rows[0];
  }
}

module.exports = Message;
