const axios = require('axios');
const logger = require('../../config/logger');
const config = require('../../config/env');

class TeamsService {
  constructor() {
    this.webhookConfig = config.webhook.teams;
    this.webhookUrl = this.webhookConfig.url;
    this.integrationName = this.webhookConfig.name;
  }

  async sendMessage(message, isError = false) {
    try {
      if (!this.webhookUrl || this.webhookUrl === 'YOUR_TEAMS_WEBHOOK_URL_HERE') {
        logger.warn('Teams webhook URL not configured', { message });
        return;
      }

      const payload = {
        type: 'message',
        attachments: [
          {
            contentType: 'application/vnd.microsoft.card.adaptive',
            content: {
              $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
              type: 'AdaptiveCard',
              version: '1.4',
              body: [
                {
                  type: 'TextBlock',
                  text: isError ? '❌ Shopify Connector Alert' : '✅ Shopify Connector Status',
                  weight: 'Bolder',
                  size: 'Medium',
                  color: isError ? 'Attention' : 'Good'
                },
                {
                  type: 'TextBlock',
                  text: message,
                  wrap: true,
                  color: 'Default'
                },
                {
                  type: 'TextBlock',
                  text: `🕐 ${new Date().toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'Australia/Sydney'
                  })}`,
                  size: 'Small',
                  isSubtle: true
                },
                {
                  type: 'FactSet',
                  facts: [
                    {
                      title: 'Environment',
                      value: process.env.NODE_ENV || 'development'
                    },
                    {
                      title: 'Service',
                      value: this.integrationName
                    }
                  ]
                }
              ]
            }
          }
        ]
      };

    await axios.post(this.webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

      logger.info('Teams notification sent successfully', { isError });
    } catch (error) {
      logger.error('Failed to send Teams notification', { 
        error: error.message,
        message: message 
      });
    }
  }

  async sendOrderNotification(orderData, status = 'success') {
    const isError = status === 'error' || status === 'failed';
    const color = isError ? 'Attention' : status === 'warning' ? 'Warning' : 'Good';

    try {
      if (!this.webhookUrl || this.webhookUrl === 'YOUR_TEAMS_WEBHOOK_URL_HERE') {
        logger.warn('Teams webhook URL not configured for order notification');
        return;
      }

      const body = [
        {
          type: 'TextBlock',
          text: `📦 Order Processing ${status.toUpperCase()}`,
          weight: 'Bolder',
          size: 'Medium',
          color: color
        },
        {
          type: 'TextBlock',
          text: `Order ${orderData.orderNumber || 'Unknown'} from ${orderData.store || 'Unknown store'}`,
          wrap: true,
          color: 'Default'
        },
        
        {
          type: 'FactSet',
          facts: [
            {
              title: 'Order ID',
              value: orderData.shopifyOrderId || 'N/A'
            },
            {
              title: 'Store',
              value: orderData.store || 'N/A'
            },
            {
              title: 'Environment',
              value: process.env.NODE_ENV || 'development'
            }
          ]
        }
      ];

      // Add error details if present
      if (orderData.error) {
        body.push({
          type: 'TextBlock',
          text: 'Error Details:',
          weight: 'Bolder',
          color: 'Attention',
          spacing: 'Medium'
        });
        body.push({
          type: 'TextBlock',
          text: `\`\`\`${orderData.error}\`\`\``,
          wrap: true,
          color: 'Default'
        });
      }

      body.push({
        type: 'TextBlock',
        text: `🕐 ${new Date().toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'Australia/Sydney'
        })}`,
        size: 'Small',
        isSubtle: true,
        spacing: 'Medium'
      });

      const payload = {
        type: 'message',
        attachments: [
          {
            contentType: 'application/vnd.microsoft.card.adaptive',
            content: {
              $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
              type: 'AdaptiveCard',
              version: '1.4',
              body: body
            }
          }
        ]
      };

      await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      logger.info('Teams order notification sent', { 
        orderId: orderData.shopifyOrderId, 
        status 
      });
    } catch (error) {
      logger.error('Failed to send Teams order notification', { 
        error: error.message,
        stack: error.stack,
        orderId: orderData.shopifyOrderId,
        status: status
      });
    }
  }
}

module.exports = TeamsService;
