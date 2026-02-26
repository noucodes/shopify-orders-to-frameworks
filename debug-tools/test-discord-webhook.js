const DiscordService = require('../src/logger/webhooks/discord.service');
const logger = require('../src/config/logger');

async function testDiscordWebhook() {
  console.log('🧪 Testing Discord Webhook Service...\n');

  // Test 1: Basic message
  console.log('📝 Test 1: Basic message');
  try {
    const discord = new DiscordService();
    await discord.sendMessage('Test message from webhook test', false);
    console.log('✅ Basic message test passed\n');
  } catch (error) {
    console.log('❌ Basic message test failed:', error.message, '\n');
  }

  // Test 2: Error message
  console.log('📝 Test 2: Error message');
  try {
    const discord = new DiscordService();
    await discord.sendMessage('Test error message from webhook test', true);
    console.log('✅ Error message test passed\n');
  } catch (error) {
    console.log('❌ Error message test failed:', error.message, '\n');
  }

  // Test 3: Order notification with small payload
  console.log('📝 Test 3: Order notification with small payload');
  try {
    const discord = new DiscordService();
    const smallPayload = {
      validateOnly: false,
      dsSalesOrder: {
        salesOrder: [{
          idCust: 1043,
          custOrderRef: "TEST001",
          despatchMethod: "COUR"
        }]
      }
    };

    await discord.sendOrderNotification({
      shopifyOrderId: '12345',
      orderNumber: 'TEST001',
      store: 'burdens',
      error: null,
      payload: smallPayload
    }, 'success');
    console.log('✅ Small payload test passed\n');
  } catch (error) {
    console.log('❌ Small payload test failed:', error.message, '\n');
  }

  // Test 4: Order notification with large payload (should use file attachment)
  console.log('📝 Test 4: Order notification with large payload');
  try {
    const discord = new DiscordService();
    const largePayload = {
      validateOnly: false,
      dsSalesOrder: {
        salesOrder: [{
          idCust: 1043,
          custOrderRef: "TEST002",
          despatchMethod: "COUR",
          salesOrderLine: Array.from({ length: 50 }, (_, i) => ({
            lineNo: i + 1,
            idProd: `PROD${i.toString().padStart(3, '0')}`,
            qtyTran: 1,
            unitSell: 99.99,
            idUom: "EA",
            comment: `Test product ${i + 1} with a very long description that should make the payload quite large and exceed the Discord embed limits`,
            priceOverrideReason: "Shopify"
          }))
        }]
      }
    };

    await discord.sendOrderNotification({
      shopifyOrderId: '67890',
      orderNumber: 'TEST002',
      store: 'burdens',
      error: null,
      payload: largePayload
    }, 'success');
    console.log('✅ Large payload test passed\n');
  } catch (error) {
    console.log('❌ Large payload test failed:', error.message, '\n');
  }

  // Test 5: Order notification with error
  console.log('📝 Test 5: Order notification with error');
  try {
    const discord = new DiscordService();
    const errorPayload = {
      validateOnly: false,
      dsSalesOrder: {
        salesOrder: [{
          idCust: 1043,
          custOrderRef: "TEST003",
          despatchMethod: "COUR"
        }]
      }
    };

    await discord.sendOrderNotification({
      shopifyOrderId: '11111',
      orderNumber: 'TEST003',
      store: 'burdens',
      error: 'Unit Sell Price for product DISCWEB cannot be negative',
      payload: errorPayload
    }, 'error');
    console.log('✅ Error notification test passed\n');
  } catch (error) {
    console.log('❌ Error notification test failed:', error.message, '\n');
  }

  // Test 6: Check webhook configuration
  console.log('📝 Test 6: Webhook configuration check');
  try {
    const discord = new DiscordService();
    console.log('Webhook URL configured:', !!discord.webhookUrl);
    console.log('Integration name:', discord.integrationName);
    console.log('✅ Configuration test passed\n');
  } catch (error) {
    console.log('❌ Configuration test failed:', error.message, '\n');
  }

  console.log('🎯 Discord webhook testing complete!');
  console.log('\n📋 Summary:');
  console.log('- If tests passed, your Discord webhook is working correctly');
  console.log('- If tests failed, check your DISCORD_WEBHOOK_URL in .env');
  console.log('- Large payloads should be sent as file attachments');
  console.log('- Small payloads should appear in the embed fields');
}

// Run the test
if (require.main === module) {
  testDiscordWebhook().catch(console.error);
}

module.exports = testDiscordWebhook;
