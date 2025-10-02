const Tenant = require('../models/Tenant');

class TenantController {
  static async create(req, res) {
    try {
      const { name, subdomain, domain, contactEmail, phone, address } = req.body;

      if (!name || !subdomain || !contactEmail) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate subdomain format
      const subdomainRegex = /^[a-z0-9-]+$/;
      if (!subdomainRegex.test(subdomain)) {
        return res.status(400).json({ 
          error: 'Invalid subdomain format. Use only lowercase letters, numbers, and hyphens.' 
        });
      }

      // Check if subdomain already exists
      const existingTenant = await Tenant.findBySubdomain(subdomain);
      if (existingTenant) {
        return res.status(409).json({ error: 'Subdomain already taken' });
      }

      // Create tenant
      const tenant = await Tenant.create({
        name,
        subdomain,
        domain,
        contactEmail,
        phone,
        address
      });

      res.status(201).json({
        message: 'Tenant created successfully',
        tenant: {
          id: tenant.id,
          name: tenant.name,
          subdomain: tenant.subdomain,
          contactEmail: tenant.contact_email
        }
      });
    } catch (error) {
      console.error('Tenant creation error:', error);
      res.status(500).json({ error: 'Failed to create tenant' });
    }
  }

  static async getTenant(req, res) {
    try {
      if (!req.tenant) {
        return res.status(400).json({ error: 'Tenant context required' });
      }

      res.json({
        id: req.tenant.id,
        name: req.tenant.name,
        subdomain: req.tenant.subdomain,
        domain: req.tenant.domain,
        contactEmail: req.tenant.contact_email,
        phone: req.tenant.phone,
        address: req.tenant.address,
        timezone: req.tenant.timezone,
        isActive: req.tenant.is_active,
        createdAt: req.tenant.created_at
      });
    } catch (error) {
      console.error('Get tenant error:', error);
      res.status(500).json({ error: 'Failed to get tenant information' });
    }
  }

  static async updateTenant(req, res) {
    try {
      if (!req.tenant) {
        return res.status(400).json({ error: 'Tenant context required' });
      }

      const allowedUpdates = ['name', 'domain', 'contact_email', 'phone', 'address', 'timezone', 'settings'];
      const updates = {};

      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      const updatedTenant = await Tenant.update(req.tenant.id, updates);

      res.json({
        message: 'Tenant updated successfully',
        tenant: {
          id: updatedTenant.id,
          name: updatedTenant.name,
          subdomain: updatedTenant.subdomain,
          domain: updatedTenant.domain,
          contactEmail: updatedTenant.contact_email,
          phone: updatedTenant.phone,
          address: updatedTenant.address,
          timezone: updatedTenant.timezone
        }
      });
    } catch (error) {
      console.error('Update tenant error:', error);
      res.status(500).json({ error: 'Failed to update tenant' });
    }
  }
}

module.exports = TenantController;
