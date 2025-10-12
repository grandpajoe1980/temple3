const pool = require('../config/database');
const { hashPassword } = require('../utils/auth');

class User {
  static async create({ tenantId, email, password, firstName, lastName, phone }) {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, tenant_id, email, first_name, last_name, phone, is_active, is_verified, created_at`,
      [tenantId, normalizedEmail, passwordHash, firstName, lastName, phone]
    );

    return result.rows[0];
  }

  static async findByEmail(tenantId, email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE tenant_id = $1 AND LOWER(email) = LOWER($2)',
      [tenantId, email]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, tenant_id, email, first_name, last_name, phone, is_active, is_verified, last_login, created_at FROM users WHERE id = $1',
      [id]
    );
    
    return result.rows[0];
  }

  static async updateLastLogin(id) {
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  }

  static async getByTenant(tenantId, limit = 100, offset = 0) {
    const result = await pool.query(
      `SELECT id, tenant_id, email, first_name, last_name, phone, is_active, is_verified, last_login, created_at
       FROM users WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [tenantId, limit, offset]
    );
    
    return result.rows;
  }
}

module.exports = User;
