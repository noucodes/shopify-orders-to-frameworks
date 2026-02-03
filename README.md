# Shopify to Frameworks ERP Connector

A Node.js application that receives Shopify webhook orders and transforms them into Frameworks ERP sales orders.

## 🚀 Overview

This connector automatically processes Shopify orders from multiple stores and creates corresponding sales orders in the Frameworks ERP system. It handles order transformation, customer mapping, and error tracking with comprehensive debugging capabilities.

## 📋 Features

- **Multi-store Support**: Handles orders from `burdens`, `bathroomhq`, and `plumbershq` stores
- **Real-time Processing**: Webhook-based order reception with immediate acknowledgment
- **Automatic Transformation**: Converts Shopify orders to Frameworks ERP format
- **Customer Mapping**: Maps each store to specific Frameworks customer IDs
- **Error Handling**: Comprehensive error tracking and retry logic
- **Database Storage**: SQLite database for order persistence and status tracking
- **Debug Logging**: Detailed logging throughout the order processing pipeline

## 🏗️ Architecture

```
Shopify Webhook(webhook.js)
            ↓
Express Server(server.js)
            ↓
SQLite Database(orders.db)
            ↓
Transform Service(transform.service.js)
            ↓
Frameworks ERP(frameworks.service.js)

```

## 📁 Project Structure

```
src/
├── config/
│   └── env.js              # Environment configuration
├── db/
│   └── sqlite.js           # Database connection and schema
├── routes/
│   └── webhook.js          # Webhook endpoint handlers
├── services/
│   ├── frameworks.service.js  # Frameworks ERP API integration
│   └── transform.service.js   # Order transformation logic
├── utils/
│   └── verifyWebhook.js    # Shopify webhook verification
├── queue/
│   └── order.queue.js      # Order queuing logic
├── server.js               # Express server setup
└── index.js                # Application entry point

debug-tools/                # Debugging utilities
├── check-db.js            # Database inspection tool
├── check-errors.js        # Failed orders analyzer
├── clear-orders.js        # Database cleanup utility
├── generate-payload.js    # Payload generation for testing
└── create-webhook-samples.js # Sample webhook data generator

webhook-samples/           # Sample webhook and payload data
├── raw-shopify-webhook.json
├── frameworks-payload.json
└── transformation-summary.json
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000

# Shopify Configuration
SHOPIFY_SHOP=burdens.myshopify.com
SHOPIFY_TOKEN=shpat_xxx
SHOPIFY_WEBHOOK_SECRET=xxxx

# Frameworks ERP Configuration
FRAMEWORKS_API_BASE=http://192.168.5.138:9200/fw-prod/web/api/v1
FRAMEWORKS_API_KEY=xxxx
FRAMEWORKS_USERNAME=your_username
FRAMEWORKS_PASSWORD=your_password

# Processing Schedule
POLL_INTERVAL_CRON=*/5 * * * *
```

### Store Customer Mapping

The system automatically maps stores to Frameworks customer IDs:

| Store | Frameworks Customer ID |
|-------|----------------------|
| `burdens` | 1043 |
| `bathroomhq` | 75293 |
| `plumbershq` | 467 |

## 🚀 Getting Started

### Prerequisites

- Node.js 14+
- NPM or Yarn
- SQLite3
- Windows Server or Windows 10/11 (for 24/7 operation)

### Quick Start (Recommended)

```bash
# Complete setup - installs everything in one go
scripts\setup.bat
```

This single command handles:
- ✅ Code setup (dependencies, .env file)
- ✅ Windows Service installation
- ✅ ngrok configuration and startup
- ✅ Webhook URL generation

### Manual Setup

If you prefer step-by-step setup:

1. **Code Setup Only**
   ```bash
   scripts\code_setup.bat
   ```

2. **Run Application**
   ```bash
   scripts\code_run.bat
   ```

3. **Install Windows Service** (optional, for 24/7 operation)
   ```bash
   scripts\install-service.bat
   ```

4. **Setup ngrok** (optional, for webhooks)
   ```bash
   scripts\ngrok-setup.bat
   scripts\ngrok-start
   ```

### Development

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start

# Quick code setup
npm run setup-code

# Run manually
npm run run
```

## 🖥️ Windows 24/7 Setup

For production deployment on Windows, the recommended approach is to run the application as a Windows Service with ngrok for external access.

### Quick Setup

```bash
# 1. Install as Windows Service (run as Administrator)
scripts/install-service.bat

# 2. Setup ngrok tunnel
scripts/setup-ngrok.bat

# 3. Start ngrok tunnel
scripts/ngrok-manager.bat start
```

### Windows Service Installation

**Install the service**:
```bash
# Run as Administrator
scripts/install-service.bat
```

**Service Management**:
```bash
# Start/stop service
scripts/service-manager.bat start
scripts/service-manager.bat stop

# Check status
scripts/service-manager.bat status

# Restart service
scripts/service-manager.bat restart
```

### ngrok Tunnel Setup

**Setup ngrok**:
```bash
scripts/setup-ngrok.bat
```

**Start ngrok tunnel**:
```bash
scripts/ngrok-manager.bat start
```

**Get your webhook URL**:
- Open http://localhost:4040 in your browser
- Look for the "Forwarding" URL (e.g., `https://abc123.ngrok.io`)
- Use this for your Shopify webhook configuration

**Webhook URL Format**:
```
https://abc123.ngrok.io/webhooks/{store}/orders-create
```

Replace `{store}` with: `burdens`, `bathroomhq`, or `plumbershq`

### Management Commands

```bash
# Service management
scripts/service-manager.bat status
scripts/service-manager.bat restart

# ngrok management  
scripts/ngrok-manager.bat status
scripts/ngrok-manager.bat url
scripts/ngrok-manager.bat web

# Test connectivity
scripts/test-ngrok.bat
```

### Environment Configuration for Production

Create a production `.env` file:

```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Shopify Configuration
SHOPIFY_SHOP=burdens.myshopify.com
SHOPIFY_TOKEN=shpat_xxx
SHOPIFY_WEBHOOK_SECRET=xxxx

# Frameworks ERP Configuration
FRAMEWORKS_API_BASE=http://192.168.5.138:9200/fw-prod/web/api/v1
FRAMEWORKS_API_KEY=xxxx
FRAMEWORKS_USERNAME=your_username
FRAMEWORKS_PASSWORD=your_password

# Processing Schedule
POLL_INTERVAL_CRON=*/5 * * * *
```

### Firewall Configuration

Ensure the following ports are open in Windows Firewall:

- **Port 3000** (default) - For webhook reception
- **Port 443** (if using HTTPS) - For secure webhooks

```bash
# Add firewall rule (run as Administrator)
netsh advfirewall firewall add rule name="Shopify Connector" dir=in action=allow protocol=TCP localport=3000
```

### Performance Optimization

**Windows Service Settings**:
```javascript
// In service-install.js - already configured
nodeOptions: [
  '--max-old-space-size=4096'  // Increase memory limit
]
```

**Log Management**:
```bash
# Monitor log files
node scripts/debug-tools/log-manager.js monitor

# Clean old logs
node scripts\debug-tools\log-manager.js clean
```

### Troubleshooting

**Service Won't Start**:
```bash
# Check service status
sc query ShopifyFrameworksConnector

# Check event log
eventvwr.msc

# Test manually
scripts\code_run.bat
```

**Port Already in Use**:
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

**Permission Issues**:
- Run installation scripts as Administrator
- Check .env file permissions
- Verify logs folder write access

### Uninstallation

**Complete Removal**:
```bash
# Remove Windows Service
scripts\service-manager.bat uninstall

# Stop ngrok if running
scripts\ngrok-manager.bat stop
```

This removes:
- Windows Service
- (Does not remove application files)

## 🌐 ngrok Setup

ngrok exposes your local server to the internet for Shopify webhooks.

### Quick Start

```bash
# 1. Setup ngrok (one-time)
scripts/setup-ngrok.bat

# 2. Start ngrok tunnel
scripts/ngrok-manager.bat start

# 3. Get webhook URL from http://localhost:4040
# 4. Configure Shopify webhook
```

### Installation

1. **Download ngrok** from https://ngrok.com/download
2. **Extract ngrok.exe** to project folder
3. **Authenticate** (optional):
   ```bash
   ngrok authtoken YOUR_AUTH_TOKEN
   ```

### Webhook Configuration

**Get your ngrok URL**:
- Open http://localhost:4040
- Look for "Forwarding" URL: `https://abc123.ngrok.io`

**Shopify Webhook URL**:
```
https://abc123.ngrok.io/webhooks/{store}/orders-create
```

Replace `{store}` with: `burdens`, `bathroomhq`, or `plumbershq`

### Management

```bash
# ngrok control
scripts/ngrok-manager.bat start/stop/status/url/web/logs

# Test connectivity
scripts/test-ngrok.bat
```

### Web Interface

Access http://localhost:4040 to:
- Monitor tunnel status
- Inspect webhook requests
- View logs

## 📡 Webhook Setup

### Shopify Webhook Configuration

1. **Create webhook in Shopify Admin**
   - Go to Settings → Notifications → Webhooks
   - Create webhook for "Order creation"
   - Set URL: `https://your-domain.com/webhooks/{store}/orders-create`
   - Set format: JSON
   - Add webhook secret from environment variables

2. **Supported Store Endpoints**
   - `burdens`: `/webhooks/burdens/orders-create`
   - `bathroomhq`: `/webhooks/bathroomhq/orders-create`
   - `plumbershq`: `/webhooks/plumbershq/orders-create`

## 🔄 Order Processing Flow

### 1. Webhook Reception
```javascript
POST /webhooks/{store}/orders-create
Content-Type: application/json
X-Shopify-Hmac-Sha256: {signature}
```

### 2. Order Storage
- Order is stored in SQLite database with `status='pending'`
- Full Shopify payload is preserved for transformation
- Store identifier is saved for customer mapping

### 3. Order Transformation
- Shopify order is transformed to Frameworks ERP format
- Customer ID is mapped based on store
- Line items are processed with proper unit of measure
- Shipping address is normalized

### 4. Frameworks Integration
- Session management with automatic login/renewal
- Sales order creation with error handling
- Retry logic for authentication failures

## 📊 Database Schema

```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shopify_order_id TEXT UNIQUE,
  payload TEXT,
  store TEXT,
  status TEXT,           -- 'pending', 'success', 'failed'
  attempts INTEGER DEFAULT 0,
  error TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🐛 Debugging & Logging

### Production Logging System

The application now includes a comprehensive logging system with Winston for production-ready log management:

#### **Log Files Created**:
- `logs/app-YYYY-MM-DD.log` - Main application logs
- `logs/error-YYYY-MM-DD.log` - Error-only logs  
- `logs/debug-YYYY-MM-DD.log` - Debug-level logs
- `logs/exceptions-YYYY-MM-DD.log` - Uncaught exceptions
- `logs/rejections-YYYY-MM-DD.log` - Unhandled promise rejections

#### **Log Rotation**:
- **Daily rotation** - New log file each day
- **Size limits** - 20MB per file
- **Retention** - 14 days for app logs, 30 days for errors
- **Compression** - Old files automatically compressed

#### **Environment Configuration**:
```env
NODE_ENV=production
LOG_LEVEL=info  # debug, info, warn, error
```

#### **Logging Methods**:

The application provides specialized logging methods for different contexts:

```javascript
// Standard logging methods
logger.debug(message, metadata)
logger.info(message, metadata)
logger.warn(message, metadata)
logger.error(message, metadata)

// Application-specific methods
logger.webhook(message, metadata)     // 🔔 Webhook-related events
logger.processing(message, metadata)  // 🔍 Order processing events
logger.frameworks(message, metadata)  // 🔐 Frameworks API events
logger.success(message, metadata)     // ✅ Success events
logger.orderError(message, metadata)  // ❌ Order processing errors
```

#### **Log Metadata**:
All logging methods accept optional metadata objects for structured logging:

```javascript
logger.webhook('Order received', {
  orderId: '12345',
  store: 'burdens',
  totalPrice: '299.99'
});

logger.orderError('Processing failed', {
  orderId: '12345',
  error: 'Connection timeout',
  retryCount: 3
});
```

### Debug Tools

Use the utilities in the `debug-tools/` folder:

```bash
# Check database contents
node debug-tools/check-db.js

# Analyze failed orders
node debug-tools/check-errors.js

# Clear failed orders
node debug-tools/clear-orders.js

# Clear all orders
node debug-tools/clear-orders.js --all

# Manage log files
node debug-tools/log-manager.js

# Clean old log files
node debug-tools/log-manager.js --clean
```

### Log Management

```bash
# View log status and recent entries
node debug-tools/log-manager.js

# Clean logs older than 7 days
node debug-tools/log-manager.js --clean
```

### Debug Logging

The application provides comprehensive debug logging with contextual information:

- 🔔 **Webhook Reception**: Store, order ID, request details
- 🔍 **Order Processing**: Database queries, parsing status, customer mapping
- 🔧 **Payload Building**: Transformation progress
- 🔐 **Frameworks API**: Login attempts, session management, API calls
- ✅ **Success Events**: Order completion, successful operations
- ❌ **Error Handling**: Detailed error messages with stack traces and metadata

### Sample Log Output

```
2026-02-03 08:15:23 [INFO]: 🔔 [DEBUG] Webhook received for store: burdens
2026-02-03 08:15:23 [INFO]: Sent 200 OK response to Shopify
2026-02-03 08:15:24 [INFO]: 🔍 [DEBUG] Starting order processing job...
2026-02-03 08:15:24 [INFO]: � [DEBUG] Found pending order: 32, Shopify ID: 6656601784575.0
2026-02-03 08:15:24 [INFO]: 🔍 [DEBUG] Parsing Shopify order payload...
2026-02-03 08:15:24 [INFO]: 🔍 [DEBUG] Successfully parsed order: #10001
2026-02-03 08:15:24 [INFO]: � [DEBUG] Mapping customer for store: burdens -> ID: 1043
2026-02-03 08:15:24 [INFO]: 🔐 [DEBUG] Attempting to login to Frameworks ERP...
2026-02-03 08:15:25 [INFO]: 🔐 [DEBUG] Successfully logged in to Frameworks ERP
2026-02-03 08:15:25 [INFO]: 🔐 [DEBUG] Creating sales order in Frameworks ERP...
2026-02-03 08:15:26 [INFO]: 🔐 [DEBUG] Sales order created successfully
2026-02-03 08:15:26 [INFO]: ✅ [SUCCESS] Order 32 successfully processed in Frameworks ERP
```

## 🛠️ API Endpoints

### Webhook Endpoint

```
POST /webhooks/{store}/orders-create
```

**Response**: `200 OK` (immediate acknowledgment)

**Request Body**: Shopify order JSON payload

**Headers**:
- `X-Shopify-Hmac-Sha256`: Webhook signature verification
- `Content-Type: application/json`

## 📝 Payload Transformation

### Shopify to Frameworks Mapping

| Shopify Field | Frameworks Field | Notes |
|---------------|------------------|-------|
| `order.name` | `custOrderRef` | Order reference |
| `customer.email` | `contactEmail` | Customer email |
| `shipping_address.name` | `contactName` | Contact name |
| `line_items[].sku` | `salesOrderLine[].idProd` | Product SKU |
| `line_items[].quantity` | `salesOrderLine[].qtyTran` | Quantity |
| `line_items[].price` | `salesOrderLine[].unitSell` | Unit price |
| `created_at` | `dateOrd` | Order date (YYYY-MM-DD) |

### Sample Payloads

See `webhook-samples/` folder for:
- `raw-shopify-webhook.json` - Complete Shopify webhook
- `frameworks-payload.json` - Transformed Frameworks payload
- `transformation-summary.json` - Mapping summary

## 🔒 Security

### Webhook Verification

- HMAC signature verification using `SHOPIFY_WEBHOOK_SECRET`
- Only processes verified Shopify webhooks
- Raw body capture for signature validation

### API Security

- Frameworks API uses session-based authentication
- API key authentication for additional security
- Credentials stored in environment variables

## 🚨 Error Handling

### Error Types

1. **Webhook Errors**: Invalid signature, malformed JSON
2. **Database Errors**: Connection issues, constraint violations
3. **Transformation Errors**: Invalid order data, missing fields
4. **Frameworks API Errors**: Authentication failures, validation errors

### Error Recovery

- Failed orders are stored with error details
- Automatic retry for authentication failures
- Detailed error logging for troubleshooting
- Orders don't block processing of new orders

## 📈 Monitoring

### Order Status Tracking

- **Pending**: Waiting to be processed
- **Success**: Successfully sent to Frameworks
- **Failed**: Error occurred (with retry count)

### Performance Metrics

- Order processing time
- API response times
- Error rates by type
- Database query performance

## 🔄 Maintenance

### Database Cleanup

```bash
# Clear failed orders
node debug-tools/clear-orders.js

# Check database health
node debug-tools/check-db.js
```

### Log Management

- Debug logs are output to console
- Consider implementing log rotation for production
- Monitor error patterns for proactive maintenance

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with comprehensive testing
4. Update documentation
5. Submit pull request


## 🆘 Support

For issues and questions:
1. Check debug logs for error details
2. Review webhook samples for expected format
3. Verify environment configuration
4. Test with debug tools

---

**Last Updated**: February 2026
**Version**: 1.0.0