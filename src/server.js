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

    // For cloud databases, just check if environment variables are set
    if (process.env.DATABASE_URL) {
      // PostgreSQL/Cloud database - assume healthy if env vars exist
      health.database = 'connected';
      health.database_type = 'postgresql';
      logger.info('Health check passed - cloud database configured', { status: health.status });
      res.status(200).json(health);
    } else {
      // SQLite/Local database - do actual connectivity check
      try {
        const db = require('./db/sqlite');
        db.get('SELECT 1 as test', [], (err, row) => {
          if (err) {
            health.status = 'unhealthy';
            health.database = 'disconnected';
            health.error = err.message;
            logger.error('Health check failed - database error', { error: err.message });
            return res.status(503).json(health);
          }
          
          health.database = 'connected';
          health.database_type = 'sqlite';
          logger.info('Health check passed', { status: health.status });
          res.status(200).json(health);
        });
      } catch (error) {
        health.status = 'unhealthy';
        health.database = 'error';
        health.error = error.message;
        logger.error('Health check failed - database module error', { error: error.message });
        res.status(503).json(health);
      }
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

