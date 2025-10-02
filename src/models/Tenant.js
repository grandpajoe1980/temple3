const pool = require('../config/database');

class Tenant {
  static async create({ name, subdomain, domain, contactEmail, phone, address }) {
    const result = await pool.query(
      `INSERT INTO tenants (name, subdomain, domain, contact_email, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, subdomain, domain, contactEmail, phone, address]
    );
    
    return result.rows[0];
  }

  static async findBySubdomain(subdomain) {
    const result = await pool.query(
      'SELECT * FROM tenants WHERE subdomain = $1',
      [subdomain]
    );
    
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM tenants WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      fields.push(`${key} = $${paramCount}`);
      values.push(updates[key]);
      paramCount++;
    });

    values.push(id);

    const result = await pool.query(
      `UPDATE tenants SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async list(limit = 100, offset = 0) {
    const result = await pool.query(
      'SELECT * FROM tenants ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    return result.rows;
  }
}

module.exports = Tenant;
