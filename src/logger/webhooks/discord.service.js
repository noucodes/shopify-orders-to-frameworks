const axios = require('axios');
const logger = require('../../config/logger');
const config = require('../../config/env');

class DiscordService {
  constructor() { 
    this.webhookConfig = config.webhook.discord;
    this.webhookUrl = this.webhookConfig.url;
    this.integrationName = this.webhookConfig.name;
  }

  async sendMessage(message, isError = false) {
    try {
      if (!this.webhookUrl || this.webhookUrl === 'YOUR_DISCORD_WEBHOOK_URL_HERE') {
        logger.warn('Discord webhook URL not configured', { message });
        return;
      }

      const payload = {
        username: this.integrationName,
        embeds: [{
          color: isError ? 0xFF0000 : 0x00FF00,
          title: isError ? '❌ Shopify Connector Alert' : '✅ Shopify Connector Status',
          description: message,
          timestamp: new Date().toISOString(),
          footer: {
            text: `Environment: ${process.env.NODE_ENV || 'development'}`
          }
        }]
      };

      await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      logger.info('Discord notification sent successfully', { isError });
    } catch (error) {
      logger.error('Failed to send Discord notification', { 
        error: error.message,
        message: message 
      });
    }
  }

  async sendOrderNotification(orderData, status = 'success') {
    const isError = status === 'error' || status === 'failed';
    const color = isError ? 0xFF0000 : status === 'warning' ? 0xFFA500 : 0x00FF00;
    const emoji = isError ? '❌' : status === 'warning' ? '⚠️' : '✅';

    try {
      if (!this.webhookUrl || this.webhookUrl === 'YOUR_DISCORD_WEBHOOK_URL_HERE') {
        logger.warn('Discord webhook URL not configured for order notification');
        return;
      }

      const fields = [
        { name: 'Order ID', value: orderData.shopifyOrderId || 'N/A', inline: true },
        { name: 'Store', value: orderData.store || 'N/A', inline: true },
        { name: 'Status', value: status.toUpperCase(), inline: true }
      ];

      if (orderData.error) {
        fields.push({
          name: 'Error',
          value: `\`\`\`${orderData.error}\`\`\``,
          inline: false
        });
      }

      // ✅ Prepare full payload string
      const payloadString = orderData.payload
        ? typeof orderData.payload === 'string'
          ? orderData.payload
          : JSON.stringify(orderData.payload, null, 2)
        : null;

      // ✅ If payload fits in embed, add it as a field
      if (payloadString && payloadString.length <= 1000) {
        fields.push({
          name: '🔧 Full Payload',
          value: `\`\`\`json\n${payloadString}\`\`\``,
          inline: false
        });
      }

      const embed = {
        color,
        title: `${emoji} Order Processing ${status.toUpperCase()}`,
        description: `Order ${orderData.orderNumber || 'Unknown'} from ${orderData.store || 'Unknown store'}`,
        fields,
        timestamp: new Date().toISOString(),
        footer: { text: `Environment: ${process.env.NODE_ENV || 'development'}` }
      };

      // ✅ If payload is too large for embed, send as file attachment
      if (payloadString && payloadString.length > 1000) {
        const FormData = require('form-data');
        const form = new FormData();

        form.append('payload_json', JSON.stringify({
          username: this.integrationName,
          embeds: [embed]
        }));

        form.append('files[0]', Buffer.from(payloadString), {
          filename: `payload-${orderData.shopifyOrderId || 'unknown'}.json`,
          contentType: 'application/json'
        });

        await axios.post(this.webhookUrl, form, {
          headers: form.getHeaders(),
          timeout: 10000
        });

      } else {
        // ✅ Normal send without file
        await axios.post(this.webhookUrl, {
          username: this.integrationName,
          embeds: [embed]
        }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        });
      }

      logger.info('Discord order notification sent', {
        orderId: orderData.shopifyOrderId,
        status
      });

    } catch (error) {
      logger.error('Failed to send Discord order notification', {
        error: error.message,
        orderId: orderData.shopifyOrderId
      });
    }
  }
}

module.exports = DiscordService;
