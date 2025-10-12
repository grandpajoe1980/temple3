const User = require('../models/User');
const { comparePassword, generateToken } = require('../utils/auth');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      if (!req.tenant) {
        return res.status(400).json({
          error: 'Tenant context required. Please include the X-Tenant-Subdomain header.'
        });
      }

      const normalizedEmail = email?.trim().toLowerCase();
      const normalizedFirstName = firstName?.trim();
      const normalizedLastName = lastName?.trim();
      const normalizedPhone = phone?.trim();

      if (!normalizedEmail || !password || !normalizedFirstName || !normalizedLastName) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if user already exists
      const existingUser = await User.findByEmail(req.tenant.id, normalizedEmail);
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Create user
      const user = await User.create({
        tenantId: req.tenant.id,
        email: normalizedEmail,
        password,
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        phone: normalizedPhone
      });

      // Generate token
      const token = generateToken({
        userId: user.id,
        tenantId: user.tenant_id,
        email: user.email
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!req.tenant) {
        return res.status(400).json({
          error: 'Tenant context required. Please select your temple before signing in.'
        });
      }

      const normalizedEmail = email?.trim().toLowerCase();

      if (!normalizedEmail || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user
      const user = await User.findByEmail(req.tenant.id, normalizedEmail);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (!user.is_active) {
        return res.status(403).json({ error: 'Account is inactive' });
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await User.updateLastLogin(user.id);

      // Generate token
      const token = generateToken({
        userId: user.id,
        tenantId: user.tenant_id,
        email: user.email
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        isActive: user.is_active,
        isVerified: user.is_verified,
        lastLogin: user.last_login,
        createdAt: user.created_at
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ error: 'Failed to get user information' });
    }
  }
}

module.exports = AuthController;
