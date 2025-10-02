const pool = require('../config/database');

class CalendarEvent {
  static async create({ tenantId, title, description, startTime, endTime, location, eventType, isRecurring, recurrenceRule, createdBy }) {
    const result = await pool.query(
      `INSERT INTO calendar_events (tenant_id, title, description, start_time, end_time, location, event_type, is_recurring, recurrence_rule, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [tenantId, title, description, startTime, endTime, location, eventType, isRecurring, recurrenceRule, createdBy]
    );
    
    return result.rows[0];
  }

  static async findById(id, tenantId) {
    const result = await pool.query(
      'SELECT * FROM calendar_events WHERE id = $1 AND tenant_id = $2',
      [id, tenantId]
    );
    
    return result.rows[0];
  }

  static async list(tenantId, { limit = 50, offset = 0, startDate, endDate, eventType }) {
    let query = 'SELECT * FROM calendar_events WHERE tenant_id = $1';
    const params = [tenantId];
    let paramCount = 2;

    if (startDate) {
      query += ` AND start_time >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      query += ` AND start_time <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    if (eventType) {
      query += ` AND event_type = $${paramCount}`;
      params.push(eventType);
      paramCount++;
    }

    query += ` ORDER BY start_time ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async update(id, tenantId, updates) {
    const allowedFields = ['title', 'description', 'start_time', 'end_time', 'location', 'event_type', 'is_recurring', 'recurrence_rule'];
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
      `UPDATE calendar_events SET ${fields.join(', ')} WHERE id = $${paramCount} AND tenant_id = $${paramCount + 1} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id, tenantId) {
    const result = await pool.query(
      'DELETE FROM calendar_events WHERE id = $1 AND tenant_id = $2 RETURNING id',
      [id, tenantId]
    );
    
    return result.rows[0];
  }
}

module.exports = CalendarEvent;
