const DiscordService = require('./discord.service');
const TeamsService = require('./teams.service');
const logger = require('../../config/logger');
const config = require('../../config/env');

class WebhookService {
  constructor() {
    this.discord = new DiscordService();
    this.teams = new TeamsService();
    this.enabledChannels = this.getEnabledChannels();
  }

  getEnabledChannels() {
    const discordEnabled = this.discord.webhookUrl && 
                         this.discord.webhookUrl !== 'YOUR_DISCORD_WEBHOOK_URL_HERE';
    const teamsEnabled = this.teams.webhookUrl && 
                       this.teams.webhookUrl !== 'YOUR_TEAMS_WEBHOOK_URL_HERE';
    
    return {
      discord: discordEnabled,
      teams: teamsEnabled
    };
  }

  async sendMessage(message, isError = false) {
    const promises = [];

    if (this.enabledChannels.discord) {
      promises.push(this.discord.sendMessage(message, isError));
    }

    if (this.enabledChannels.teams) {
      promises.push(this.teams.sendMessage(message, isError));
    }

    if (promises.length === 0) {
      logger.warn('No webhook channels configured', { message });
      return;
    }

    try {
      await Promise.allSettled(promises);
      logger.info('Webhook notifications sent', { 
        channels: Object.keys(this.enabledChannels).filter(key => this.enabledChannels[key]),
        isError 
      });
    } catch (error) {
      logger.error('Failed to send webhook notifications', { 
        error: error.message,
        message 
      });
    }
  }

  async sendOrderNotification(orderData, status = 'success') {
    const promises = [];

    if (this.enabledChannels.discord) {
      promises.push(this.discord.sendOrderNotification(orderData, status));
    }

    if (this.enabledChannels.teams) {
      promises.push(this.teams.sendOrderNotification(orderData, status));
    }

    if (promises.length === 0) {
      logger.warn('No webhook channels configured for order notification', { 
        orderId: orderData.shopifyOrderId,
        status 
      });
      return;
    }

    try {
      await Promise.allSettled(promises);
      logger.info('Order webhook notifications sent', { 
        orderId: orderData.shopifyOrderId,
        status,
        channels: Object.keys(this.enabledChannels).filter(key => this.enabledChannels[key])
      });
    } catch (error) {
      logger.error('Failed to send order webhook notifications', { 
        error: error.message,
        orderId: orderData.shopifyOrderId,
        status 
      });
    }
  }

  async sendHealthCheck(healthData, isError = false) {
    const message = this.formatHealthMessage(healthData, isError);
    await this.sendMessage(message, isError);
  }

  async sendSystemAlert(alertType, details) {
    const message = this.formatSystemAlert(alertType, details);
    await this.sendMessage(message, true);
  }

  formatHealthMessage(healthData, isError) {
    const status = isError ? '❌ UNHEALTHY' : '✅ HEALTHY';
    const uptime = Math.floor(healthData.uptime / 3600);
    const memory = healthData.memory ? `${healthData.memory.used}MB/${healthData.memory.total}MB` : 'N/A';
    
    return `**${status}** - Shopify Connector\n` +
           `🕐 Uptime: ${uptime}h\n` +
           `💾 Memory: ${memory}\n` +
           `🌐 Environment: ${healthData.environment}\n` +
           `📊 Database: ${healthData.database}\n` +
           `🔗 Port: ${healthData.port}`;
  }

  formatSystemAlert(alertType, details) {
    const alerts = {
      'order_failed': `❌ Order Processing Failed\n\nOrder #${details.orderNumber} from ${details.store} failed to process.\n\nError: ${details.error}`,
      'database_error': `🗄️ Database Error\n\nDatabase connection or query failed.\n\nError: ${details.error}`,
      'frameworks_error': `🔗 Frameworks API Error\n\nFailed to create sales order in Frameworks ERP.\n\nError: ${details.error}`,
      'webhook_error': `🪝 Webhook Error\n\nShopify webhook processing failed.\n\nError: ${details.error}`,
      'system_restart': `🔄 System Restart\n\nThe Shopify connector service has restarted.\n\nUptime: ${details.uptime}s`,
      'high_memory': `⚠️ High Memory Usage\n\nMemory usage is above threshold.\n\nUsage: ${details.memoryUsed}MB\nThreshold: ${details.threshold}MB`
    };

    return alerts[alertType] || `⚠️ System Alert\n\n${details.message || 'Unknown alert'}`;
  }

  // Test webhook connectivity
  async testWebhooks() {
    const testMessage = '🧪 Webhook Test Message\n\nThis is a test message to verify webhook connectivity.';
    await this.sendMessage(testMessage, false);
  }

  // Get webhook status
  getWebhookStatus() {
    return {
      discord: {
        enabled: this.enabledChannels.discord,
        url: this.discord.webhookUrl ? '***configured***' : 'not configured'
      },
      teams: {
        enabled: this.enabledChannels.teams,
        url: this.teams.webhookUrl ? '***configured***' : 'not configured'
      }
    };
  }
}

module.exports = WebhookService;
