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

  static async findBySubdomain(subdomain, { includeInactive = true } = {}) {
    const result = await pool.query(
      'SELECT * FROM tenants WHERE LOWER(subdomain) = LOWER($1)',
      [subdomain]
    );

    const tenant = result.rows[0];

    if (!tenant) {
      return null;
    }

    if (!includeInactive && !tenant.is_active) {
      return null;
    }

    return tenant;
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

  static async searchPublic({ searchTerm = '', limit = 20, offset = 0, includeInactive = false } = {}) {
    const values = [];
    const conditions = [];

    if (!includeInactive) {
      conditions.push('is_active = true');
    }

    if (searchTerm) {
      const likeValue = `%${searchTerm.toLowerCase()}%`;
      const searchParamIndex = values.length + 1;
      values.push(likeValue);
      conditions.push(
        `(
          LOWER(name) LIKE $${searchParamIndex}
          OR LOWER(subdomain) LIKE $${searchParamIndex}
          OR LOWER(COALESCE(domain, '')) LIKE $${searchParamIndex}
          OR LOWER(COALESCE(address, '')) LIKE $${searchParamIndex}
        )`
      );
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM tenants ${whereClause}`;
    const dataQuery = `
      SELECT id, name, subdomain, domain, contact_email AS "contactEmail", address, timezone
      FROM tenants
      ${whereClause}
      ORDER BY name ASC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    const countResult = await pool.query(countQuery, values);
    const dataResult = await pool.query(dataQuery, [...values, limit, offset]);

    return {
      tenants: dataResult.rows,
      total: Number(countResult.rows[0]?.count || 0)
    };
  }
}

module.exports = Tenant;
