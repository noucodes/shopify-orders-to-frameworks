const express = require('express');
const webhookRoutes = require('./routes/webhook');
const logger = require('./config/logger');

module.exports = function startServer() {
  const app = express();

  app.use(express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
        external: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100
      },
      version: require('../package.json').version,
      database: process.env.DATABASE_URL ? 'postgresql' : 'sqlite'
    };

    logger.info('Health check passed', { status: health.status });
    res.status(200).json(health);
  });

  // Deep health check endpoint with actual database connectivity
  app.get('/health/deep', async (req, res) => {
    try {
      if (process.env.DATABASE_URL) {
        // PostgreSQL/Cloud database - actual connection test
        const { Pool } = require('pg');
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          max: 1,
          connectionTimeoutMillis: 5000,
        });
        
        const client = await pool.connect();
        try {
          const result = await client.query('SELECT 1 as test, NOW() as timestamp');
          await client.query('SELECT COUNT(*) as order_count FROM orders LIMIT 1');
        } finally {
          client.release();
          await pool.end();
        }
        
        res.status(200).json({ 
          status: 'healthy', 
          database: 'connected',
          database_type: 'postgresql',
          timestamp: new Date().toISOString()
        });
      } else {
        // SQLite/Local database - actual connection test
        const db = require('./db/sqlite');
        
        await new Promise((resolve, reject) => {
          db.get('SELECT 1 as test, datetime("now") as timestamp', [], (err, row) => {
            if (err) return reject(err);
            resolve(row);
          });
        });
        
        res.status(200).json({ 
          status: 'healthy', 
          database: 'connected',
          database_type: 'sqlite',
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      logger.error('Deep health check failed', { error: err.message });
      res.status(503).json({ 
        status: 'unhealthy', 
        database: 'disconnected',
        error: err.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Root endpoint for basic info
  app.get('/', (req, res) => {
    res.json({
      service: 'Shopify to Frameworks Connector',
      status: 'running',
      version: require('../package.json').version,
      endpoints: {
        health: '/health',
        webhooks: '/webhooks/{store}/orders-create'
      }
    });
  });

  app.use('/webhooks', webhookRoutes);

  const server = app.listen(process.env.PORT, () => {
    logger.info(`Connector running on port ${process.env.PORT}`, {
      port: process.env.PORT,
      nodeEnv: process.env.NODE_ENV || 'development',
      logLevel: process.env.LOG_LEVEL || 'info'
    });
  });

  // Graceful shutdown handling
  const gracefulShutdown = (signal) => {
    logger.info(`Received ${signal}, starting graceful shutdown...`);
    
    server.close((err) => {
      if (err) {
        logger.error('Error during server shutdown', { error: err.message });
        process.exit(1);
      }
      
      logger.info('Server closed successfully');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.orderError('Uncaught Exception', { 
      error: error.message,
      stack: error.stack 
    });
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.orderError('Unhandled Rejection', { 
      reason: reason,
      promise: promise 
    });
    process.exit(1);
  });

  return server;
};

