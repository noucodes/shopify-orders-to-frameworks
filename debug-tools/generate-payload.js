const fs = require('fs');
const path = require('path');

// Sample Shopify order data (based on your order.json)
const sampleShopifyOrder = {
  "id": 7024924328248,
  "admin_graphql_api_id": "gid://shopify/Order/7024924328248",
  "app_id": 580111,
  "browser_ip": "124.168.244.176",
  "buyer_accepts_marketing": false,
  "cancel_reason": null,
  "cancelled_at": null,
  "cart_token": "hWN8NkuA21j8PnBupCD0aVaG",
  "checkout_id": 40574186225976,
  "checkout_token": "13a6ec8e2cdb041955d695f61c9c62b5",
  "client_details": {
    "accept_language": "en-AU,en;q=0.9",
    "browser_height": null,
    "browser_ip": "124.168.244.176",
    "browser_width": null,
    "session_hash": null,
    "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/23C71 Safari/604.1 [FBAN/FBIOS;FBAV/546.0.0.31.71;FBBV/870642032;FBDV/iPhone17,1;FBMD/iPhone;FBSN/iOS;FBSV/26.2.1;FBSS/3;FBID/phone;FBLC/en_GB;FBOP/5;FBRV/875542561;IABMV/1]"
  },
  "closed_at": null,
  "confirmation_number": "JHM6M8YGN",
  "confirmed": true,
  "contact_email": "obiziak@internode.on.net",
  "created_at": "2026-02-04T15:25:51+11:00",
  "currency": "AUD",
  "current_shipping_price_set": {
    "shop_money": {
      "amount": "0.00",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "0.00",
      "currency_code": "AUD"
    }
  },
  "current_subtotal_price": "90.16",
  "current_subtotal_price_set": {
    "shop_money": {
      "amount": "90.16",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "90.16",
      "currency_code": "AUD"
    }
  },
  "current_total_additional_fees_set": null,
  "current_total_discounts": "0.00",
  "current_total_discounts_set": {
    "shop_money": {
      "amount": "0.00",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "0.00",
      "currency_code": "AUD"
    }
  },
  "current_total_duties_set": null,
  "current_total_price": "90.16",
  "current_total_price_set": {
    "shop_money": {
      "amount": "90.16",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "90.16",
      "currency_code": "AUD"
    }
  },
  "current_total_tax": "8.20",
  "current_total_tax_set": {
    "shop_money": {
      "amount": "8.20",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "8.20",
      "currency_code": "AUD"
    }
  },
  "customer_locale": "en",
  "device_id": null,
  "discount_codes": [],
  "duties_included": false,
  "email": "obiziak@internode.on.net",
  "estimated_taxes": false,
  "financial_status": "paid",
  "fulfillment_status": null,
  "landing_site": "/products/fienza-isabella-rail-shower-with-integratefienza-p-444105?utm_content=Facebook_UA&utm_source=facebook&variant=51617078673720&utm_medium=paid&utm_id=120226231661240097&utm_term=120226231661280097&utm_campaign=120226231661240097&fbclid=IwZXh0bgNhZ",
  "landing_site_ref": null,
  "location_id": null,
  "merchant_business_entity_id": "MTIyOTA1NzQ5NTgy",
  "merchant_of_record_app_id": null,
  "name": "#BHQ1952",
  "note": "",
  "note_attributes": [],
  "number": 952,
  "order_number": 1952,
  "order_status_url": "https://bathroomhq.com.au/22905749582/orders/1834c3406c1b5fc45bec6e49a88ec292/authenticate?key=4718df94d8db5406fa9edab0d8767106",
  "original_total_additional_fees_set": null,
  "original_total_duties_set": null,
  "payment_gateway_names": [
    "shopify_payments"
  ],
  "phone": null,
  "po_number": null,
  "presentment_currency": "AUD",
  "processed_at": "2026-02-04T15:25:46+11:00",
  "reference": null,
  "referring_site": "http://m.facebook.com",
  "source_identifier": null,
  "source_name": "web",
  "source_url": null,
  "subtotal_price": "90.16",
  "subtotal_price_set": {
    "shop_money": {
      "amount": "90.16",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "90.16",
      "currency_code": "AUD"
    }
  },
  "tags": "",
  "tax_exempt": false,
  "tax_lines": [
    {
      "price": "8.20",
      "rate": 0.1,
      "title": "GST",
      "price_set": {
        "shop_money": {
          "amount": "8.20",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "8.20",
          "currency_code": "AUD"
        }
      },
      "channel_liable": false
    }
  ],
  "taxes_included": true,
  "test": false,
  "token": "1834c3406c1b5fc45bec6e49a88ec292",
  "total_cash_rounding_payment_adjustment_set": {
    "shop_money": {
      "amount": "0.00",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "0.00",
      "currency_code": "AUD"
    }
  },
  "total_cash_rounding_refund_adjustment_set": {
    "shop_money": {
      "amount": "0.00",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "0.00",
      "currency_code": "AUD"
    }
  },
  "total_discounts": "0.00",
  "total_discounts_set": {
    "shop_money": {
      "amount": "0.00",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "0.00",
      "currency_code": "AUD"
    }
  },
  "total_line_items_price": "90.16",
  "total_line_items_price_set": {
    "shop_money": {
      "amount": "90.16",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "90.16",
      "currency_code": "AUD"
    }
  },
  "total_outstanding": "0.00",
  "total_price": "90.16",
  "total_price_set": {
    "shop_money": {
      "amount": "90.16",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "90.16",
      "currency_code": "AUD"
    }
  },
  "total_shipping_price_set": {
    "shop_money": {
      "amount": "0.00",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "0.00",
      "currency_code": "AUD"
    }
  },
  "total_tax": "8.20",
  "total_tax_set": {
    "shop_money": {
      "amount": "8.20",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "8.20",
      "currency_code": "AUD"
    }
  },
  "total_tip_received": "0.00",
  "total_weight": 360,
  "updated_at": "2026-02-04T15:25:53+11:00",
  "user_id": null,
  "billing_address": {
    "first_name": "Oreste",
    "address1": "Chapman",
    "phone": null,
    "city": "Canberra",
    "zip": "2611",
    "province": "Australian Capital Territory",
    "country": "Australia",
    "last_name": "Biziak",
    "address2": "39 Percy Crescent",
    "company": null,
    "latitude": -35.3562196,
    "longitude": 149.0397642,
    "name": "Oreste Biziak",
    "country_code": "AU",
    "province_code": "ACT"
  },
  "customer": {
    "id": 9974938960184,
    "created_at": "2026-02-04T15:25:46+11:00",
    "updated_at": "2026-02-04T15:25:52+11:00",
    "first_name": "Oreste",
    "last_name": "Biziak",
    "state": "disabled",
    "note": null,
    "verified_email": true,
    "multipass_identifier": null,
    "tax_exempt": false,
    "email": "obiziak@internode.on.net",
    "phone": null,
    "currency": "AUD",
    "tax_exemptions": [],
    "admin_graphql_api_id": "gid://shopify/Customer/9974938960184",
    "default_address": {
      "id": 11128889377080,
      "customer_id": 9974938960184,
      "first_name": "Oreste",
      "last_name": "Biziak",
      "company": null,
      "address1": "Chapman",
      "address2": "39 Percy Crescent",
      "city": "Canberra",
      "province": "Australian Capital Territory",
      "country": "Australia",
      "zip": "2611",
      "phone": null,
      "name": "Oreste Biziak",
      "province_code": "ACT",
      "country_code": "AU",
      "country_name": "Australia",
      "default": true
    }
  },
  "discount_applications": [],
  "fulfillments": [],
  "line_items": [
    {
      "id": 18158998257976,
      "admin_graphql_api_id": "gid://shopify/LineItem/18158998257976",
      "current_quantity": 2,
      "fulfillable_quantity": 2,
      "fulfillment_service": "manual",
      "fulfillment_status": null,
      "gift_card": false,
      "grams": 180,
      "name": "Kaya Single Fienza Robe Hook - Gunmetal",
      "price": "45.08",
      "price_set": {
        "shop_money": {
          "amount": "45.08",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "45.08",
          "currency_code": "AUD"
        }
      },
      "product_exists": true,
      "product_id": 9378819014968,
      "properties": [],
      "quantity": 2,
      "requires_shipping": true,
      "sales_line_item_group_id": null,
      "sku": "82804GM",
      "taxable": true,
      "title": "Kaya Single Fienza Robe Hook - Gunmetal",
      "total_discount": "0.00",
      "total_discount_set": {
        "shop_money": {
          "amount": "0.00",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "0.00",
          "currency_code": "AUD"
        }
      },
      "variant_id": 48737066975544,
      "variant_inventory_management": "shopify",
      "variant_title": null,
      "vendor": "Fienza",
      "tax_lines": [
        {
          "channel_liable": false,
          "price": "8.20",
          "price_set": {
            "shop_money": {
              "amount": "8.20",
              "currency_code": "AUD"
            },
            "presentment_money": {
              "amount": "8.20",
              "currency_code": "AUD"
            }
          },
          "rate": 0.1,
          "title": "GST"
        }
      ],
      "duties": [],
      "discount_allocations": []
    }
  ],
  "payment_terms": null,
  "refunds": [],
  "shipping_address": {
    "first_name": "Oreste",
    "address1": "Chapman",
    "phone": null,
    "city": "Canberra",
    "zip": "2611",
    "province": "Australian Capital Territory",
    "country": "Australia",
    "last_name": "Biziak",
    "address2": "39 Percy Crescent",
    "company": null,
    "latitude": -35.3562196,
    "longitude": 149.0397642,
    "name": "Oreste Biziak",
    "country_code": "AU",
    "province_code": "ACT"
  },
  "shipping_lines": [
    {
      "id": 5583690006840,
      "carrier_identifier": null,
      "code": "Standard",
      "current_discounted_price_set": {
        "shop_money": {
          "amount": "0.00",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "0.00",
          "currency_code": "AUD"
        }
      },
      "discounted_price": "0.00",
      "discounted_price_set": {
        "shop_money": {
          "amount": "0.00",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "0.00",
          "currency_code": "AUD"
        }
      },
      "is_removed": false,
      "phone": null,
      "price": "0.00",
      "price_set": {
        "shop_money": {
          "amount": "0.00",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "0.00",
          "currency_code": "AUD"
        }
      },
      "requested_fulfillment_service_id": null,
      "source": "shopify",
      "title": "Standard",
      "tax_lines": [
        {
          "channel_liable": false,
          "price": "0.00",
          "price_set": {
            "shop_money": {
              "amount": "0.00",
              "currency_code": "AUD"
            },
            "presentment_money": {
              "amount": "0.00",
              "currency_code": "AUD"
            }
          },
          "rate": 0.1,
          "title": "GST"
        }
      ],
      "discount_allocations": []
    }
  ],
  "returns": [],
  "line_item_groups": []
};

// Mock the mapCustomer function
function mockMapCustomer() {
  return 1043; // burdens.myshopify.com customer ID
}

// Manually recreate the buildFrameworksPayload function
function buildFrameworksPayload(shopifyOrder) {
  const payload = {
    validateOnly: false,
    dsSalesOrder: {
      salesOrder: [
        {
          idCust: mockMapCustomer(),
          custOrderRef: shopifyOrder.name || shopifyOrder.order_number?.toString() || "SHOPIFY-" + Date.now(),
          despatchMethod: "COUR",
          dateOrd: shopifyOrder.created_at 
            ? new Date(shopifyOrder.created_at).toISOString().split('T')[0] 
            : null,
          deliverToAddress1: "NSW 2000",
          state: "NSW",
          postCode: "2000",
          zipCode: "2000",
          contactName: shopifyOrder.shipping_address?.name 
            || `${shopifyOrder.customer?.first_name || ''} ${shopifyOrder.customer?.last_name || ''}`.trim() 
            || null,
          contactPhone: shopifyOrder.shipping_address?.phone || shopifyOrder.customer?.phone || null,
          contactEmail: shopifyOrder.customer?.email || shopifyOrder.email || null,
          salesOrderLine: shopifyOrder.line_items.map((item, index) => {
            const line = {
              lineNo: index + 1,
              idProd: item.sku || item.variant_id?.toString() || item.product_id?.toString() || "",
              qtyTran: item.quantity,
              unitSell: parseFloat(item.price) || null,
              comment: item.name || item.title || null
            };

            // Add discount percentage if available
            if (item.discount_allocations?.length > 0) {
              const discountAmount = item.discount_allocations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
              line.discPerc = Math.round((discountAmount / item.quantity / parseFloat(item.price)) * 100 * 100) / 100;
            }

            return line;
          })
        }
      ]
    }
  };

  // Add instructions only if they exist
  if (shopifyOrder.note) {
    payload.dsSalesOrder.salesOrder[0].instructions = shopifyOrder.note;
    payload.dsSalesOrder.salesOrder[0].comment1 = shopifyOrder.note;
  }

  return payload;
}

// Generate the payload
console.log('🔧 Generating Frameworks payload from Shopify order...');
const payload = buildFrameworksPayload(sampleShopifyOrder);

// Save to file
fs.writeFileSync('frameworks-payload.json', JSON.stringify(payload, null, 2));
console.log('✅ Full payload saved to frameworks-payload.json');

// Also save just the line items for easier viewing
const lineItemsPayload = {
  salesOrderLines: payload.dsSalesOrder.salesOrder[0].salesOrderLine
};
fs.writeFileSync('line-items-payload.json', JSON.stringify(lineItemsPayload, null, 2));
console.log('✅ Line items saved to line-items-payload.json');

console.log('\n📋 Summary:');
console.log(`- Customer ID: ${payload.dsSalesOrder.salesOrder[0].idCust}`);
console.log(`- Order Reference: ${payload.dsSalesOrder.salesOrder[0].custOrderRef}`);
console.log(`- Order Date: ${payload.dsSalesOrder.salesOrder[0].dateOrd}`);
console.log(`- Line Items: ${payload.dsSalesOrder.salesOrder[0].salesOrderLine.length}`);
console.log(`- Total Items: ${payload.dsSalesOrder.salesOrder[0].salesOrderLine.reduce((sum, item) => sum + item.qtyTran, 0)}`);
