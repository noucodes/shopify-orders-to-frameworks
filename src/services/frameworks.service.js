const axios = require('axios');
const config = require('../config/env');
const logger = require('../config/logger');

class FrameworksService {
  constructor() {
    this.sessionId = null;
    this.sessionExpiry = null;
    this.baseUrl = config.frameworks.baseUrl;
  }

  async login() {
    try {
      logger.frameworks('Attempting to login to Frameworks ERP...');
      logger.frameworks(`Login URL: ${this.baseUrl}${config.frameworks.endpoints.login}`);
      
      const response = await axios.post(`${this.baseUrl}${config.frameworks.endpoints.login}`, {
        userid: config.frameworks.username,
        domain: "frameworks",
        password: config.frameworks.password,
        extra: config.frameworks.device
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.sessionID) {
        this.sessionId = response.data.sessionID;
        this.sessionExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
        logger.frameworks('Successfully logged in to Frameworks ERP');
        logger.frameworks(`Session ID: ${this.sessionId}`);
        return this.sessionId;
      } else {
        logger.orderError('No session ID returned from login', {
          response: response.data
        });
        throw new Error('No session ID returned from login');
      }
    } catch (error) {
      logger.orderError('Frameworks login failed', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  async validateSession() {
    if (!this.sessionId) {
      return false;
    }

    if (this.sessionExpiry && new Date() > this.sessionExpiry) {
      logger.frameworks('Session expired, need to re-login');
      return false;
    }

    try {
      logger.frameworks('Validating Frameworks session...');
      
      const response = await axios.post(`${this.baseUrl}${config.frameworks.endpoints.validateSession}`, {
        sessionId: this.sessionId
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.valid) {
        logger.frameworks('Session is valid');
        return true;
      } else {
        logger.frameworks('Session is invalid, need to re-login');
        return false;
      }
    } catch (error) {
      logger.orderError('Session validation failed', {
        error: error.message,
        response: error.response?.data
      });
      return false;
    }
  }

  async ensureValidSession() {
    const isValid = await this.validateSession();
    if (!isValid) {
      await this.login();
    }
    return this.sessionId;
  }

  async createSalesOrder(orderPayload) {
    try {
      await this.ensureValidSession();
      
      logger.frameworks('Creating sales order in Frameworks ERP...');
      logger.frameworks(`Sales Order URL: ${this.baseUrl}${config.frameworks.endpoints.createSalesOrder}`);
      console.log('Payload preview', { 
        payloadSize: JSON.stringify(orderPayload).length,
        customerRef: orderPayload.dsSalesOrder.salesOrder[0].custOrderRef,
        lineItemsCount: orderPayload.dsSalesOrder.salesOrder[0].salesOrderLine.length
      });
      
      const response = await axios.post(`${this.baseUrl}${config.frameworks.endpoints.createSalesOrder}`, 
        orderPayload, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.sessionId}`,
            'X-FLUID-CONTEXT': this.sessionId,
            'X-API-KEY': config.frameworks.apiKey
          }
        }
      );

      if (response.data.hasErrors) {
        const errorMessage = response.data.errorTable?.length > 0 
          ? response.data.errorTable.map(err => err.msg).join('; ')
          : 'Unknown Frameworks API error';
        
        logger.orderError('Sales order creation failed', {
          error: errorMessage,
          response: response.data,
          status: response.status,
          customerRef: orderPayload.dsSalesOrder.salesOrder[0].custOrderRef,
          errorTable: response.data.errorTable
        });
        
        // Throw error so transform service can handle it
        throw new Error(`Frameworks API error: ${errorMessage}`);
      } else {

      logger.frameworks('Sales order created successfully', { 
        response: response.data,
        status: response.status
      });
    }
      console.log('Response data', response.data);
      console.log('Response status', response.status);
      
      return response.data;
    } catch (error) {
      logger.orderError('Sales order creation failed', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        customerRef: orderPayload.dsSalesOrder.salesOrder[0].custOrderRef
      });
      
      // If it's an authentication error, try to login again and retry
      if (error.response?.status === 401 || error.response?.status === 403) {
        logger.frameworks('Authentication error detected, retrying with new session...');
        await this.login();
        
        logger.frameworks('Retrying sales order creation...');
        const retryResponse = await axios.post(`${this.baseUrl}${config.frameworks.endpoints.createSalesOrder}`, 
          orderPayload, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.sessionId}`,
              'X-FLUID-CONTEXT': this.sessionId,
              'X-API-KEY': config.frameworks.apiKey
            }
          }
        );

        logger.frameworks('Sales order created successfully on retry', { 
          response: retryResponse.data,
          status: retryResponse.status
        });
        
        return retryResponse.data;
      }
      
      throw error;
    }
  }
}

module.exports = new FrameworksService();
