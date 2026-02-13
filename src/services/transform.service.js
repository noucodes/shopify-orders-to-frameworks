const db = require('../db/sqlite');
const frameworksService = require('./frameworks.service');
const logger = require('../config/logger');

module.exports = async function processOrder() {
  logger.processing('Starting order processing job...');

  try {
    const order = await db.get(
      `SELECT * FROM orders WHERE status='pending' LIMIT 1`
    );
    
    if (!order) {
      logger.processing('No pending orders found');
      return;
    }
    
    logger.processing(`Found pending order: ${order.id}, Shopify ID: ${order.shopify_order_id}`);

    try {
      logger.processing('Parsing Shopify order payload...');
      const shopifyOrder = JSON.parse(order.payload);
      logger.processing(`Successfully parsed order: ${shopifyOrder.name || shopifyOrder.order_number}`);
      
      logger.processing('Building Frameworks payload...');
      const payload = buildFrameworksPayload(shopifyOrder, order.store);
      logger.processing('Frameworks payload built successfully');

      logger.frameworks('Calling Frameworks API...');
      const result = await frameworksService.createSalesOrder(payload);
      logger.frameworks('Frameworks API call successful', { result });

      logger.processing('Updating order status to success...');
      await db.run(
        `UPDATE orders SET status='success' WHERE id=?`,
        [order.id]
      );
      
      logger.success(`Order ${order.id} successfully processed in Frameworks ERP`);
    } catch (processingError) {
      logger.orderError(`Failed to process order ${order.id}: ${processingError.message}`, { 
        orderId: order.id, 
        shopifyOrderId: order.shopify_order_id,
        error: processingError.message,
        stack: processingError.stack 
      });
      
      logger.processing('Updating order status to failed...');
      await db.run(
        `UPDATE orders 
         SET attempts = attempts + 1, error=?, status='failed'
         WHERE id=?`,
        [processingError.message, order.id]
      );
    }
  } catch (dbError) {
    logger.orderError(`Database error: ${dbError.message}`, { 
      error: dbError.message,
      stack: dbError.stack 
    });
  }
};

function buildFrameworksPayload(shopifyOrder, store) {
  let despatchMethod = "COUR";
  if (!shopifyOrder.shipping_address) {
    despatchMethod = "CPKUP";
  }
  const payload = {
    validateOnly: false,
    dsSalesOrder: {
      salesOrder: [
        {
          idCust: mapCustomer(store),
          custOrderRef: shopifyOrder.name || shopifyOrder.order_number?.toString() || "SHOPIFY-" + Date.now(),
          despatchMethod: despatchMethod,
          idBranch: 8,
          refTranExternal: shopifyOrder.billing_address?.name || shopifyOrder.contactName || `${shopifyOrder.customer?.first_name || ''} ${shopifyOrder.customer?.last_name || ''}`.trim() || null,
          dateOrd: shopifyOrder.created_at 
            ? new Date(shopifyOrder.created_at).toISOString().split('T')[0] 
            : null,
          deliverToAddress1: shopifyOrder.shipping_address?.name|| shopifyOrder.billing_address?.name || `${shopifyOrder.customer?.first_name || ''} ${shopifyOrder.customer?.last_name || ''}`.trim() 
            || null,
          deliverToAddress2: shopifyOrder.shipping_address?.address1 || shopifyOrder.billing_address?.address1 || "123 Shipping Street",
          deliverToAddress3: shopifyOrder.shipping_address?.city || shopifyOrder.billing_address?.city || null,
          postCode: shopifyOrder.shipping_address?.zip || shopifyOrder.billing_address?.zip || "2000",
          zipCode: shopifyOrder.shipping_address?.zip || shopifyOrder.billing_address?.zip || "2000",
          contactName: shopifyOrder.shipping_address?.name 
            || `${shopifyOrder.customer?.first_name || ''} ${shopifyOrder.customer?.last_name || ''}`.trim() 
            || null,
          contactPhone: shopifyOrder.shipping_address?.phone || shopifyOrder.customer?.phone || shopifyOrder.billing_address?.phone ||null,
          contactEmail: shopifyOrder.customer?.email || shopifyOrder.email || null,
          deliveryFee: shopifyOrder.total_shipping_price_set?.shop_money?.amount || shopifyOrder.current_shipping_price_set?.shop_money?.amount || 0,
          salesOrderLine: shopifyOrder.line_items.map((item, index) => {
            const gst = Math.round(item.tax_lines[0]?.price / item.quantity * 100) / 100;
            const unitSell = Math.round((item.price - gst) * 100) / 100;
            const line = {
              lineNo: index + 1,
              idProd: item.sku || item.variant_id?.toString() || item.product_id?.toString() || "",
              qtyTran: item.quantity,
              unitSell: unitSell,
              idUom: "EA", // Default Unit of Measure
              comment: item.name || item.title || null,
              priceOverrideReason: "Shopify"
            };



            // Add discount percentage if available
            // if (item.discount_allocations?.length > 0) {
            //   const discountAmount = item.discount_allocations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
            //   line.discPerc = Math.round((discountAmount / item.quantity / parseFloat(item.price)) * 100 * 100) / 100;
            // }
            
            return line;
          })
        }
      ]
    }
  };

  // Add discount line item for burdens orders if total discount exists
  if (shopifyOrder.total_discounts && parseFloat(shopifyOrder.total_discounts) > 0) {
    const discountAmount = parseFloat(shopifyOrder.total_discounts);
    const nextLineNo = payload.dsSalesOrder.salesOrder[0].salesOrderLine.length + 1;
    
    payload.dsSalesOrder.salesOrder[0].salesOrderLine.push({
      lineNo: nextLineNo,
      idProd: "DISCWEB",
      qtyTran: -1,
      idUom: "EA",
      unitSell: discountAmount,
      comment: "Web Order Discount",
      priceOverrideReason:"WEB"
    });
    
    logger.processing(`Added discount line item: $${discountAmount.toFixed(2)} for burdens order with price override reason: WEB`);
  }

  // Add instructions only if they exist
  if (shopifyOrder.note) {
    payload.dsSalesOrder.salesOrder[0].instructions = shopifyOrder.note;
    payload.dsSalesOrder.salesOrder[0].comment1 = shopifyOrder.note;
  }

  return payload;
}

function mapCustomer(store) {
  const customerMap = {
    'burdens': 1043,
    'bathroomhq': 75293,
    'plumbershq': 467
  };
  
  const customerId = customerMap[store] || 1043; // Default to burdens if not found
  logger.processing(`Mapping customer for store: ${store} -> ID: ${customerId}`);
  return customerId;
}

// Export the buildFrameworksPayload function for use in debug tools
module.exports.buildFrameworksPayload = buildFrameworksPayload;
