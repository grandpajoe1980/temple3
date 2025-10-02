const pool = require('../config/database');

class ReminderBell {
  static async create({ tenantId, userId, title, reminderTime, daysOfWeek, isActive }) {
    const result = await pool.query(
      `INSERT INTO reminder_bells (tenant_id, user_id, title, reminder_time, days_of_week, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [tenantId, userId, title, reminderTime, daysOfWeek, isActive !== false]
    );
    
    return result.rows[0];
  }

  static async findById(id, tenantId, userId) {
    const result = await pool.query(
      'SELECT * FROM reminder_bells WHERE id = $1 AND tenant_id = $2 AND user_id = $3',
      [id, tenantId, userId]
    );
    
    return result.rows[0];
  }

  static async list(tenantId, userId, { limit = 50, offset = 0 }) {
    const result = await pool.query(
      'SELECT * FROM reminder_bells WHERE tenant_id = $1 AND user_id = $2 ORDER BY reminder_time ASC LIMIT $3 OFFSET $4',
      [tenantId, userId, limit, offset]
    );
    
    return result.rows;
  }

  static async update(id, tenantId, userId, updates) {
    const allowedFields = ['title', 'reminder_time', 'days_of_week', 'is_active'];
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

    values.push(id, tenantId, userId);

    const result = await pool.query(
      `UPDATE reminder_bells SET ${fields.join(', ')} WHERE id = $${paramCount} AND tenant_id = $${paramCount + 1} AND user_id = $${paramCount + 2} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id, tenantId, userId) {
    const result = await pool.query(
      'DELETE FROM reminder_bells WHERE id = $1 AND tenant_id = $2 AND user_id = $3 RETURNING id',
      [id, tenantId, userId]
    );
    
    return result.rows[0];
  }
}

module.exports = ReminderBell;
