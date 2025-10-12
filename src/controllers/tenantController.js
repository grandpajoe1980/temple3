const Tenant = require('../models/Tenant');

class TenantController {
  static async searchTenants(req, res) {
    try {
      const {
        search = '',
        limit = 20,
        offset = 0,
        includeInactive = 'false',
        religions,
        traditions,
        denominations,
        sects,
        countries,
        states,
        cities,
        sizeCategories,
        languages,
        tags,
        minAttendance,
        maxAttendance,
        foundedAfter,
        foundedBefore
      } = req.query;

      const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
      const numericOffset = Math.max(parseInt(offset, 10) || 0, 0);
      const includeInactiveTenants = includeInactive === 'true';

      const parseListParam = value => {
        if (!value) {
          return [];
        }

        const list = Array.isArray(value) ? value : String(value).split(',');

        return list
          .map(item => (typeof item === 'string' ? item.trim().toLowerCase() : ''))
          .filter(item => item.length > 0);
      };

      const parseNumberParam = value => {
        if (value === undefined || value === null || value === '') {
          return undefined;
        }

        const parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) ? parsed : undefined;
      };

      const results = await Tenant.searchPublic({
        searchTerm: typeof search === 'string' ? search.trim() : '',
        limit: numericLimit,
        offset: numericOffset,
        includeInactive: includeInactiveTenants,
        filters: {
          religions: parseListParam(religions),
          traditions: parseListParam(traditions),
          denominations: parseListParam(denominations),
          sects: parseListParam(sects),
          countries: parseListParam(countries),
          states: parseListParam(states),
          cities: parseListParam(cities),
          sizeCategories: parseListParam(sizeCategories),
          languages: parseListParam(languages),
          tags: parseListParam(tags),
          minAttendance: parseNumberParam(minAttendance),
          maxAttendance: parseNumberParam(maxAttendance),
          foundedAfter: parseNumberParam(foundedAfter),
          foundedBefore: parseNumberParam(foundedBefore)
        }
      });

      res.json({
        tenants: results.tenants,
        pagination: {
          total: results.total,
          limit: numericLimit,
          offset: numericOffset
        }
      });
    } catch (error) {
      console.error('Tenant search error:', error);
      res.status(500).json({ error: 'Failed to search tenants' });
    }
  }

  static async getTenantBySubdomain(req, res) {
    try {
      const { subdomain } = req.params;

      if (!subdomain) {
        return res.status(400).json({ error: 'Subdomain is required' });
      }

      const tenant = await Tenant.findBySubdomain(subdomain.trim(), { includeInactive: false });

      if (!tenant) {
        return res.status(404).json({ error: 'Tenant not found' });
      }

      res.json({
        tenant: {
          id: tenant.id,
          name: tenant.name,
          subdomain: tenant.subdomain,
          domain: tenant.domain,
          contactEmail: tenant.contact_email,
          phone: tenant.phone,
          address: tenant.address,
          city: tenant.city,
          stateProvince: tenant.state_province,
          country: tenant.country,
          postalCode: tenant.postal_code,
          timezone: tenant.timezone,
          religion: tenant.religion,
          tradition: tenant.tradition,
          denomination: tenant.denomination,
          sect: tenant.sect,
          sizeCategory: tenant.size_category,
          averageWeeklyAttendance: tenant.average_weekly_attendance,
          foundedYear: tenant.founded_year,
          languages: tenant.languages,
          tags: tenant.tags,
          latitude: tenant.latitude,
          longitude: tenant.longitude,
          settings: tenant.settings
        }
      });
    } catch (error) {
      console.error('Get tenant by subdomain error:', error);
      res.status(500).json({ error: 'Failed to load tenant information' });
    }
  }

  static async create(req, res) {
    try {
      const {
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
      } = req.body;

      if (!name || !subdomain || !contactEmail) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate subdomain format
      const subdomainRegex = /^[a-z0-9-]+$/;
      const normalizedSubdomain = subdomain.trim().toLowerCase();

      if (!subdomainRegex.test(normalizedSubdomain)) {
        return res.status(400).json({
          error: 'Invalid subdomain format. Use only lowercase letters, numbers, and hyphens.'
        });
      }

      // Check if subdomain already exists
      const existingTenant = await Tenant.findBySubdomain(normalizedSubdomain, { includeInactive: true });
      if (existingTenant) {
        return res.status(409).json({ error: 'Subdomain already taken' });
      }

      const normalizeString = value => (typeof value === 'string' ? value.trim() || null : null);
      const normalizeLowercaseString = value => (typeof value === 'string' ? value.trim().toLowerCase() || null : null);
      const normalizeStringArray = value => {
        if (!value) {
          return [];
        }

        const list = Array.isArray(value) ? value : String(value).split(',');
        return list
          .map(item => (typeof item === 'string' ? item.trim() : ''))
          .filter(item => item.length > 0);
      };

      const normalizeInteger = value => {
        if (value === undefined || value === null || value === '') {
          return null;
        }

        const parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) ? parsed : null;
      };

      const normalizeFloat = value => {
        if (value === undefined || value === null || value === '') {
          return null;
        }

        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : null;
      };

      // Create tenant
      const tenant = await Tenant.create({
        name: name.trim(),
        subdomain: normalizedSubdomain,
        domain: normalizeLowercaseString(domain),
        contactEmail: contactEmail.trim().toLowerCase(),
        phone: normalizeString(phone),
        address: normalizeString(address),
        city: normalizeString(city),
        stateProvince: normalizeString(stateProvince),
        country: normalizeString(country),
        postalCode: normalizeString(postalCode),
        timezone: normalizeString(timezone) || 'UTC',
        religion: normalizeString(religion),
        tradition: normalizeString(tradition),
        denomination: normalizeString(denomination),
        sect: normalizeString(sect),
        sizeCategory: normalizeLowercaseString(sizeCategory),
        averageWeeklyAttendance: normalizeInteger(averageWeeklyAttendance),
        foundedYear: normalizeInteger(foundedYear),
        languages: normalizeStringArray(languages),
        tags: normalizeStringArray(tags),
        latitude: normalizeFloat(latitude),
        longitude: normalizeFloat(longitude)
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

  static async getCurrentTenant(req, res) {
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
        city: req.tenant.city,
        stateProvince: req.tenant.state_province,
        country: req.tenant.country,
        postalCode: req.tenant.postal_code,
        timezone: req.tenant.timezone,
        religion: req.tenant.religion,
        tradition: req.tenant.tradition,
        denomination: req.tenant.denomination,
        sect: req.tenant.sect,
        sizeCategory: req.tenant.size_category,
        averageWeeklyAttendance: req.tenant.average_weekly_attendance,
        foundedYear: req.tenant.founded_year,
        languages: req.tenant.languages,
        tags: req.tenant.tags,
        latitude: req.tenant.latitude,
        longitude: req.tenant.longitude,
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

      const allowedUpdates = [
        'name',
        'domain',
        'contact_email',
        'phone',
        'address',
        'city',
        'state_province',
        'country',
        'postal_code',
        'timezone',
        'religion',
        'tradition',
        'denomination',
        'sect',
        'size_category',
        'average_weekly_attendance',
        'founded_year',
        'languages',
        'tags',
        'latitude',
        'longitude',
        'settings'
      ];
      const normalizedBody = { ...req.body };

      if (typeof normalizedBody.contactEmail === 'string') {
        normalizedBody.contact_email = normalizedBody.contactEmail.trim().toLowerCase();
        delete normalizedBody.contactEmail;
      }

      if (typeof normalizedBody.name === 'string') {
        normalizedBody.name = normalizedBody.name.trim();
      }

      if (typeof normalizedBody.domain === 'string') {
        normalizedBody.domain = normalizedBody.domain.trim().toLowerCase();
      }

      if (typeof normalizedBody.phone === 'string') {
        normalizedBody.phone = normalizedBody.phone.trim();
      }

      if (typeof normalizedBody.address === 'string') {
        normalizedBody.address = normalizedBody.address.trim();
      }

      if (typeof normalizedBody.timezone === 'string') {
        normalizedBody.timezone = normalizedBody.timezone.trim();
      }

      if (typeof normalizedBody.city === 'string') {
        normalizedBody.city = normalizedBody.city.trim();
      }

      if (typeof normalizedBody.stateProvince === 'string') {
        normalizedBody.state_province = normalizedBody.stateProvince.trim();
        delete normalizedBody.stateProvince;
      }

      if (typeof normalizedBody.country === 'string') {
        normalizedBody.country = normalizedBody.country.trim();
      }

      if (typeof normalizedBody.postalCode === 'string') {
        normalizedBody.postal_code = normalizedBody.postalCode.trim();
        delete normalizedBody.postalCode;
      }

      if (typeof normalizedBody.religion === 'string') {
        normalizedBody.religion = normalizedBody.religion.trim();
      }

      if (typeof normalizedBody.tradition === 'string') {
        normalizedBody.tradition = normalizedBody.tradition.trim();
      }

      if (typeof normalizedBody.denomination === 'string') {
        normalizedBody.denomination = normalizedBody.denomination.trim();
      }

      if (typeof normalizedBody.sect === 'string') {
        normalizedBody.sect = normalizedBody.sect.trim();
      }

      if (typeof normalizedBody.sizeCategory === 'string') {
        normalizedBody.size_category = normalizedBody.sizeCategory.trim().toLowerCase();
        delete normalizedBody.sizeCategory;
      }

      if (normalizedBody.averageWeeklyAttendance !== undefined) {
        const parsed = Number.parseInt(normalizedBody.averageWeeklyAttendance, 10);
        normalizedBody.average_weekly_attendance = Number.isFinite(parsed) ? parsed : null;
        delete normalizedBody.averageWeeklyAttendance;
      }

      if (normalizedBody.foundedYear !== undefined) {
        const parsed = Number.parseInt(normalizedBody.foundedYear, 10);
        normalizedBody.founded_year = Number.isFinite(parsed) ? parsed : null;
        delete normalizedBody.foundedYear;
      }

      if (normalizedBody.latitude !== undefined) {
        const parsed = Number.parseFloat(normalizedBody.latitude);
        normalizedBody.latitude = Number.isFinite(parsed) ? parsed : null;
      }

      if (normalizedBody.longitude !== undefined) {
        const parsed = Number.parseFloat(normalizedBody.longitude);
        normalizedBody.longitude = Number.isFinite(parsed) ? parsed : null;
      }

      if (normalizedBody.languages !== undefined) {
        const list = Array.isArray(normalizedBody.languages)
          ? normalizedBody.languages
          : String(normalizedBody.languages)
              .split(',')
              .map(item => item.trim())
              .filter(item => item.length > 0);
        normalizedBody.languages = list;
      }

      if (normalizedBody.tags !== undefined) {
        const list = Array.isArray(normalizedBody.tags)
          ? normalizedBody.tags
          : String(normalizedBody.tags)
              .split(',')
              .map(item => item.trim())
              .filter(item => item.length > 0);
        normalizedBody.tags = list;
      }

      const updates = {};

      Object.keys(normalizedBody).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = normalizedBody[key];
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
          city: updatedTenant.city,
          stateProvince: updatedTenant.state_province,
          country: updatedTenant.country,
          postalCode: updatedTenant.postal_code,
          timezone: updatedTenant.timezone,
          religion: updatedTenant.religion,
          tradition: updatedTenant.tradition,
          denomination: updatedTenant.denomination,
          sect: updatedTenant.sect,
          sizeCategory: updatedTenant.size_category,
          averageWeeklyAttendance: updatedTenant.average_weekly_attendance,
          foundedYear: updatedTenant.founded_year,
          languages: updatedTenant.languages,
          tags: updatedTenant.tags,
          latitude: updatedTenant.latitude,
          longitude: updatedTenant.longitude
        }
      });
    } catch (error) {
      console.error('Update tenant error:', error);
      res.status(500).json({ error: 'Failed to update tenant' });
    }
  }
}

module.exports = TenantController;
