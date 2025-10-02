const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const tenantRoutes = require('./routes/tenant');
const religiousTextsRoutes = require('./routes/religiousTexts');
const calendarEventsRoutes = require('./routes/calendarEvents');
const messagesRoutes = require('./routes/messages');
const podcastsRoutes = require('./routes/podcasts');
const videosRoutes = require('./routes/videos');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/religious-texts', religiousTextsRoutes);
app.use('/api/events', calendarEventsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/podcasts', podcastsRoutes);
app.use('/api/videos', videosRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Temple3 - Multi-tenant spiritual community platform',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      tenant: '/api/tenant',
      religiousTexts: '/api/religious-texts',
      events: '/api/events',
      messages: '/api/messages',
      podcasts: '/api/podcasts',
      videos: '/api/videos'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

module.exports = app;
