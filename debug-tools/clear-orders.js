const db = require('../src/db/sqlite');

async function clearOrders(clearAll = false) {
  try {
    if (clearAll) {
      console.log('🗑️ Clearing ALL orders...');
      await db.run("DELETE FROM orders"); 
      console.log('✅ Deleted ALL orders');
    } else {
      console.log('🧹 Clearing failed orders...');
      await db.run("DELETE FROM orders WHERE status='failed'");
      console.log('✅ Deleted failed orders');
    }
    
    // Check remaining orders
    const allOrders = await db.all('SELECT * FROM orders');
    console.log(`📊 Remaining orders: ${allOrders.length}`);
    
    if (allOrders.length > 0) {
      allOrders.forEach(order => {
        console.log(`🆔 ID: ${order.id}, Shopify ID: ${order.shopify_order_id}, Status: ${order.status}, Store: ${order.store}`);
      });
    } else {
      console.log('📋 Database is now empty');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing orders:', error);
    process.exit(1);
  }
}

async function deleteSpecificOrder(orderId, isShopifyId = false) {
  try {
    let order;
    
    if (isShopifyId) {
      console.log(`🔍 Looking for order with Shopify ID: ${orderId}`);
      order = await db.get('SELECT * FROM orders WHERE shopify_order_id = ?', [orderId]);
    } else {
      console.log(`🔍 Looking for order with database ID: ${orderId}`);
      order = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);
    }
    
    if (!order) {
      console.log(`❌ Order not found!`);
      console.log(`   Searched for ${isShopifyId ? 'Shopify ID' : 'Database ID'}: ${orderId}`);
      
      // Show available orders for reference
      const allOrders = await db.all('SELECT id, shopify_order_id, status, store FROM orders LIMIT 10');
      if (allOrders.length > 0) {
        console.log('\n📋 Available orders:');
        allOrders.forEach(o => {
          console.log(`   DB ID: ${o.id}, Shopify ID: ${o.shopify_order_id}, Status: ${o.status}, Store: ${o.store}`);
        });
      }
      process.exit(1);
    }
    
    console.log(`📋 Found order:`);
    console.log(`   DB ID: ${order.id}`);
    console.log(`   Shopify ID: ${order.shopify_order_id}`);
    console.log(`   Status: ${order.status}`);
    console.log(`   Store: ${order.store}`);
    console.log(`   Created: ${order.created_at}`);
    
    // Delete the order
    if (isShopifyId) {
      await db.run('DELETE FROM orders WHERE shopify_order_id = ?', [orderId]);
    } else {
      await db.run('DELETE FROM orders WHERE id = ?', [orderId]);
    }
    
    console.log(`✅ Successfully deleted order!`);
    
    // Check remaining orders
    const remainingCount = await db.get('SELECT COUNT(*) as count FROM orders');
    console.log(`📊 Remaining orders: ${remainingCount.count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    process.exit(1);
  }
}



// Check command line arguments
const clearAll = process.argv.includes('--all') || process.argv.includes('-a');
const deleteById = process.argv.includes('--id') || process.argv.includes('-i');
const deleteByShopifyId = process.argv.includes('--shopify-id') || process.argv.includes('-s');

// Get order ID from arguments
const getIdArg = (flag) => {
  const index = process.argv.indexOf(flag);
  return index !== -1 && index + 1 < process.argv.length ? process.argv[index + 1] : null;
};

if (clearAll) {
  console.log('⚠️  WARNING: This will delete ALL orders from the database!');
  console.log('📝 Usage: node clear-orders.js [--all|-a]');
  console.log('   --all or -a: Clear all orders (default: only failed orders)');
  console.log('');
  clearOrders(true);
} else if (deleteById) {
  const orderId = getIdArg('--id') || getIdArg('-i');
  if (!orderId) {
    console.log('❌ Error: --id requires an order ID');
    console.log('📝 Usage: node clear-orders.js --id <order-id>');
    console.log('   --id or -i: Delete specific order by database ID');
    process.exit(1);
  }
  deleteSpecificOrder(orderId, false);
} else if (deleteByShopifyId) {
  const shopifyId = getIdArg('--shopify-id') || getIdArg('-s');
  if (!shopifyId) {
    console.log('❌ Error: --shopify-id requires an order ID');
    console.log('📝 Usage: node clear-orders.js --shopify-id <shopify-order-id>');
    console.log('   --shopify-id or -s: Delete specific order by Shopify order ID');
    process.exit(1);
  }
  deleteSpecificOrder(shopifyId, true);
} else {
  console.log('📝 Usage: node clear-orders.js [option]');
  console.log('');
  console.log('Options:');
  console.log('   (no args)      : Clear only failed orders (default)');
  console.log('   --all or -a     : Clear ALL orders');
  console.log('   --id <num>      : Delete specific order by database ID');
  console.log('   --shopify-id <num>: Delete specific order by Shopify order ID');
  console.log('');
  console.log('Examples:');
  console.log('   node clear-orders.js                    # Clear failed orders only');
  console.log('   node clear-orders.js --all              # Clear all orders');
  console.log('   node clear-orders.js --id 123          # Delete order with DB ID 123');
  console.log('   node clear-orders.js --shopify-id 456  # Delete order with Shopify ID 456');
  console.log('');
  clearOrders(false);
}
