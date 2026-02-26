const webhookService = require('../src/logger/webhooks');

async function quickTest() {
  console.log('🔧 Quick Webhook Test');
  
  try {
    // Test status
    const status = webhookService.getWebhookStatus();
    console.log('✅ Status:', JSON.stringify(status, null, 2));
    
    // Test basic message
    await webhookService.sendMessage('Quick test message', false);
    console.log('✅ Basic message sent');
    
    // Test order notification
    await webhookService.sendOrderNotification({
      shopifyOrderId: 'test-123',
      orderNumber: 'TEST-123',
      store: 'burdens',
      error: null,
      payload: { test: 'payload', data: 'test data' }
    }, 'success');
    console.log('✅ Order notification sent');
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

quickTest();
