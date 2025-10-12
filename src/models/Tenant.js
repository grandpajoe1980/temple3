const pool = require('../config/database');

class Tenant {
  static async create({
    name,
    subdomain,
    domain,
    contactEmail,
    phone,
    address,
    city,
    stateProvince,
    country,
    postalCode,
    timezone,
    religion,
    tradition,
    denomination,
    sect,
    sizeCategory,
    averageWeeklyAttendance,
    foundedYear,
    languages,
    tags,
    latitude,
    longitude
  }) {
    const result = await pool.query(
      `INSERT INTO tenants (
         name,
         subdomain,
         domain,
         contact_email,
         phone,
         address,
         city,
         state_province,
         country,
         postal_code,
         timezone,
         religion,
         tradition,
         denomination,
         sect,
         size_category,
         average_weekly_attendance,
         founded_year,
         languages,
         tags,
         latitude,
         longitude
       )
       VALUES (
         $1, $2, $3, $4, $5, $6,
         $7, $8, $9, $10, $11,
         $12, $13, $14, $15, $16,
         $17, $18, $19::text[], $20::text[], $21, $22
       )
       RETURNING *`,
      [
        name,
        subdomain,
        domain,
        contactEmail,
        phone,
        address,
        city,
        stateProvince,
        country,
        postalCode,
        timezone,
        religion,
        tradition,
        denomination,
        sect,
        sizeCategory,
        averageWeeklyAttendance,
        foundedYear,
        languages || [],
        tags || [],
        latitude,
        longitude
      ]
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
      if (Array.isArray(updates[key])) {
        values.push(updates[key]);
      } else {
        values.push(updates[key]);
      }
      paramCount++;
    });

    values.push(id);

    const result = await pool.query(
      `UPDATE tenants SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async searchPublic({
    searchTerm = '',
    limit = 20,
    offset = 0,
    includeInactive = false,
    filters = {}
  } = {}) {
    const values = [];
    const conditions = [];

    if (!includeInactive) {
      conditions.push('is_active = true');
    }

    const sanitizedSearchTerm = typeof searchTerm === 'string' ? searchTerm.toLowerCase().trim() : '';

    if (sanitizedSearchTerm) {
      const stopWords = new Set(['and', 'or', 'the', 'a', 'an', 'of', 'in', 'at', 'to', 'for']);
      const tokens = sanitizedSearchTerm
        .split(/[^\p{L}\p{N}]+/u)
        .map(token => token.trim())
        .filter(token => token.length > 0 && !stopWords.has(token));

      const limitedTokens = tokens.slice(0, 10);

      const searchableExpressions = [
        'COALESCE(name, \'\')',
        'COALESCE(subdomain, \'\')',
        'COALESCE(domain, \'\')',
        'COALESCE(address, \'\')',
        'COALESCE(city, \'\')',
        'COALESCE(state_province, \'\')',
        'COALESCE(country, \'\')',
        'COALESCE(postal_code, \'\')',
        'COALESCE(religion, \'\')',
        'COALESCE(tradition, \'\')',
        'COALESCE(denomination, \'\')',
        'COALESCE(sect, \'\')',
        'COALESCE(size_category, \'\')',
        "COALESCE(array_to_string(languages, ','), '')",
        "COALESCE(array_to_string(tags, ','), '')"
      ];

      if (limitedTokens.length > 0) {
        limitedTokens.forEach(token => {
          const likeValue = `%${token}%`;
          const tokenConditions = [];

          searchableExpressions.forEach(expression => {
            values.push(likeValue);
            tokenConditions.push(`LOWER(${expression}) LIKE $${values.length}`);
          });

          if (tokenConditions.length) {
            conditions.push(`(${tokenConditions.join(' OR ')})`);
          }
        });
      } else {
        const likeValue = `%${sanitizedSearchTerm}%`;
        const fallbackConditions = [];

        searchableExpressions.forEach(expression => {
          values.push(likeValue);
          fallbackConditions.push(`LOWER(${expression}) LIKE $${values.length}`);
        });

        if (fallbackConditions.length) {
          conditions.push(`(${fallbackConditions.join(' OR ')})`);
        }
      }
    }

    const {
      religions = [],
      traditions = [],
      denominations = [],
      sects = [],
      countries = [],
      states = [],
      cities = [],
      sizeCategories = [],
      languages = [],
      tags = [],
      minAttendance,
      maxAttendance,
      foundedAfter,
      foundedBefore
    } = filters;

    const pushListCondition = (column, list) => {
      if (!Array.isArray(list) || list.length === 0) {
        return;
      }

      values.push(list.map(item => item.toLowerCase()));
      const paramIndex = values.length;
      conditions.push(`LOWER(${column}) = ANY($${paramIndex})`);
    };

    pushListCondition('religion', religions);
    pushListCondition('tradition', traditions);
    pushListCondition('denomination', denominations);
    pushListCondition('sect', sects);
    pushListCondition('country', countries);
    pushListCondition('state_province', states);
    pushListCondition('city', cities);
    pushListCondition('size_category', sizeCategories);

    if (Array.isArray(languages) && languages.length > 0) {
      values.push(languages.map(language => language.toLowerCase()));
      const paramIndex = values.length;
      conditions.push(`
        EXISTS (
          SELECT 1 FROM unnest(COALESCE(languages, ARRAY[]::text[])) AS lang
          WHERE LOWER(lang) = ANY($${paramIndex})
        )
      `);
    }

    if (Array.isArray(tags) && tags.length > 0) {
      values.push(tags.map(tag => tag.toLowerCase()));
      const paramIndex = values.length;
      conditions.push(`
        EXISTS (
          SELECT 1 FROM unnest(COALESCE(tags, ARRAY[]::text[])) AS tag
          WHERE LOWER(tag) = ANY($${paramIndex})
        )
      `);
    }

    if (Number.isFinite(minAttendance)) {
      values.push(minAttendance);
      conditions.push(`average_weekly_attendance >= $${values.length}`);
    }

    if (Number.isFinite(maxAttendance)) {
      values.push(maxAttendance);
      conditions.push(`average_weekly_attendance <= $${values.length}`);
    }

    if (Number.isFinite(foundedAfter)) {
      values.push(foundedAfter);
      conditions.push(`founded_year >= $${values.length}`);
    }

    if (Number.isFinite(foundedBefore)) {
      values.push(foundedBefore);
      conditions.push(`founded_year <= $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM tenants ${whereClause}`;
    const dataQuery = `
      SELECT
        id,
        name,
        subdomain,
        domain,
        contact_email AS "contactEmail",
        phone,
        address,
        city,
        state_province AS "stateProvince",
        country,
        postal_code AS "postalCode",
        timezone,
        religion,
        tradition,
        denomination,
        sect,
        size_category AS "sizeCategory",
        average_weekly_attendance AS "averageWeeklyAttendance",
        founded_year AS "foundedYear",
        languages,
        tags,
        latitude,
        longitude
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
