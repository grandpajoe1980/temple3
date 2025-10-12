const pool = require('../config/database');

const tenantMiddleware = async (req, res, next) => {
  try {
    // Extract tenant identifier from subdomain, domain, or header
    const tenantIdentifier =
      req.headers['x-tenant-id'] ||
      req.headers['x-tenant-subdomain'] ||
      req.query.tenant;

    if (!tenantIdentifier) {
      // For routes that don't require tenant context (like tenant registration)
      return next();
    }

    const identifier =
      typeof tenantIdentifier === 'string' ? tenantIdentifier.trim() : tenantIdentifier;

    if (!identifier) {
      return res.status(400).json({ error: 'Tenant identifier is required' });
    }

    const normalizedIdentifier =
      typeof identifier === 'string' ? identifier.toLowerCase() : identifier;

    // Lookup tenant
    const result = await pool.query(
      `SELECT * FROM tenants
       WHERE id::text = $1
         OR LOWER(subdomain) = $2
         OR LOWER(COALESCE(domain, '')) = $3`,
      [identifier, normalizedIdentifier, normalizedIdentifier]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const tenant = result.rows[0];

    if (!tenant.is_active) {
      return res.status(403).json({ error: 'Tenant account is inactive' });
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const requireTenant = (req, res, next) => {
  if (!req.tenant) {
    return res.status(400).json({ error: 'Tenant context required' });
  }
  next();
};

const validateTenantAccess = async (req, res, next) => {
  try {
    // Ensure user belongs to the requested tenant
    if (req.user && req.tenant && req.user.tenantId !== req.tenant.id) {
      return res.status(403).json({ error: 'Access denied to this tenant' });
    }
    next();
  } catch (error) {
    console.error('Tenant access validation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { tenantMiddleware, requireTenant, validateTenantAccess };
