const fs = require('fs');
const path = require('path');

// Import the actual buildFrameworksPayload function from transform.service.js
const { buildFrameworksPayload } = require('../src/services/transform.service.js');

// Sample Shopify order data (based on your order.json)
const sampleShopifyOrder1 = {
  "id": 6674573197567,
  "admin_graphql_api_id": "gid://shopify/Order/6674573197567",
  "app_id": 580111,
  "browser_ip": "120.21.91.140",
  "buyer_accepts_marketing": false,
  "cancel_reason": null,
  "cancelled_at": null,
  "cart_token": "hWN8SUSEn39nf33pSEnZQpAC",
  "checkout_id": 38351668904191,
  "checkout_token": "369e8af43904e0bd1ee90dd7d4a84f43",
  "client_details": {
    "accept_language": "en-AU",
    "browser_height": null,
    "browser_ip": "120.21.91.140",
    "browser_width": null,
    "session_hash": null,
    "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1"
  },
  "closed_at": null,
  "confirmation_number": "0IHLP55KN",
  "confirmed": true,
  "contact_email": "dmm_8868@hotmail.com",
  "created_at": "2026-02-06T16:13:36+11:00",
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
  "current_subtotal_price": "1569.00",
  "current_subtotal_price_set": {
    "shop_money": {
      "amount": "1569.00",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "1569.00",
      "currency_code": "AUD"
    }
  },
  "current_total_additional_fees_set": null,
  "current_total_discounts": "30.00",
  "current_total_discounts_set": {
    "shop_money": {
      "amount": "30.00",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "30.00",
      "currency_code": "AUD"
    }
  },
  "current_total_duties_set": null,
  "current_total_price": "1569.00",
  "current_total_price_set": {
    "shop_money": {
      "amount": "1569.00",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "1569.00",
      "currency_code": "AUD"
    }
  },
  "current_total_tax": "142.64",
  "current_total_tax_set": {
    "shop_money": {
      "amount": "142.64",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "142.64",
      "currency_code": "AUD"
    }
  },
  "customer_locale": "en-AU",
  "device_id": null,
  "discount_codes": [],
  "duties_included": false,
  "email": "dmm_8868@hotmail.com",
  "estimated_taxes": false,
  "financial_status": "paid",
  "fulfillment_status": null,
  "landing_site": "/",
  "landing_site_ref": null,
  "location_id": null,
  "merchant_business_entity_id": "MTI5MzAzOTMwOTc5",
  "merchant_of_record_app_id": null,
  "name": "#BURWEB2537",
  "note": null,
  "note_attributes": [],
  "number": 1537,
  "order_number": 2537,
  "order_status_url": "https://burdensbathrooms.com.au/29303930979/orders/67bdd3481aaf9d52ffb0d4362fa26a12/authenticate?key=cd273bdb79c4ebb6bca7cbf5e56e793e",
  "original_total_additional_fees_set": null,
  "original_total_duties_set": null,
  "payment_gateway_names": [
    "paypal"
  ],
  "phone": null,
  "po_number": null,
  "presentment_currency": "AUD",
  "processed_at": "2026-02-06T16:13:33+11:00",
  "reference": null,
  "referring_site": null,
  "source_identifier": null,
  "source_name": "web",
  "source_url": null,
  "subtotal_price": "1569.00",
  "subtotal_price_set": {
    "shop_money": {
      "amount": "1569.00",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "1569.00",
      "currency_code": "AUD"
    }
  },
  "tags": "",
  "tax_exempt": false,
  "tax_lines": [
    {
      "price": "142.64",
      "rate": 0.1,
      "title": "GST",
      "price_set": {
        "shop_money": {
          "amount": "142.64",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "142.64",
          "currency_code": "AUD"
        }
      },
      "channel_liable": false
    }
  ],
  "taxes_included": true,
  "test": false,
  "token": "67bdd3481aaf9d52ffb0d4362fa26a12",
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
  "total_discounts": "30.00",
  "total_discounts_set": {
    "shop_money": {
      "amount": "30.00",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "30.00",
      "currency_code": "AUD"
    }
  },
  "total_line_items_price": "1599.00",
  "total_line_items_price_set": {
    "shop_money": {
      "amount": "1599.00",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "1599.00",
      "currency_code": "AUD"
    }
  },
  "total_outstanding": "0.00",
  "total_price": "1569.00",
  "total_price_set": {
    "shop_money": {
      "amount": "1569.00",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "1569.00",
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
  "total_tax": "142.64",
  "total_tax_set": {
    "shop_money": {
      "amount": "142.64",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "142.64",
      "currency_code": "AUD"
    }
  },
  "total_tip_received": "0.00",
  "total_weight": 0,
  "updated_at": "2026-02-06T16:13:38+11:00",
  "user_id": null,
  "billing_address": {
    "first_name": "Mengmeng",
    "address1": "34A Illuka Crescent",
    "phone": "0411846664",
    "city": "Mount Waverley",
    "zip": "3149",
    "province": "Victoria",
    "country": "Australia",
    "last_name": "Dong",
    "address2": null,
    "company": null,
    "latitude": -37.8877669,
    "longitude": 145.1438513,
    "name": "Mengmeng Dong",
    "country_code": "AU",
    "province_code": "VIC"
  },
  "customer": {
    "id": 8759459283199,
    "created_at": "2026-02-06T15:53:03+11:00",
    "updated_at": "2026-02-06T16:13:37+11:00",
    "first_name": "Mengmeng",
    "last_name": "Dong",
    "state": "disabled",
    "note": null,
    "verified_email": true,
    "multipass_identifier": null,
    "tax_exempt": false,
    "email": "dmm_8868@hotmail.com",
    "phone": null,
    "currency": "AUD",
    "tax_exemptions": [],
    "admin_graphql_api_id": "gid://shopify/Customer/8759459283199",
    "default_address": {
      "id": 10450432065791,
      "customer_id": 8759459283199,
      "first_name": "Mengmeng",
      "last_name": "Dong",
      "company": null,
      "address1": "34A Illuka Crescent",
      "address2": null,
      "city": "Mount Waverley",
      "province": "Victoria",
      "country": "Australia",
      "zip": "3149",
      "phone": "0411846664",
      "name": "Mengmeng Dong",
      "province_code": "VIC",
      "country_code": "AU",
      "country_name": "Australia",
      "default": true
    }
  },
  "discount_applications": [
    {
      "target_type": "line_item",
      "type": "automatic",
      "value": "30.0",
      "value_type": "fixed_amount",
      "allocation_method": "across",
      "target_selection": "all",
      "title": "First Online Order Discount"
    }
  ],
  "fulfillments": [],
  "line_items": [
    {
      "id": 16188899295487,
      "admin_graphql_api_id": "gid://shopify/LineItem/16188899295487",
      "attributed_staffs": [],
      "current_quantity": 1,
      "fulfillable_quantity": 1,
      "fulfillment_service": "manual",
      "fulfillment_status": null,
      "gift_card": false,
      "grams": 0,
      "name": "TOTO Washlet S2 TOTOTCF33320GAU (D-Shape) (Side Control) Washlet only",
      "price": "1599.00",
      "price_set": {
        "shop_money": {
          "amount": "1599.00",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "1599.00",
          "currency_code": "AUD"
        }
      },
      "product_exists": true,
      "product_id": 8528209543423,
      "properties": [],
      "quantity": 1,
      "requires_shipping": true,
      "sales_line_item_group_id": null,
      "sku": "TOTOTCF33320GAU",
      "taxable": true,
      "title": "TOTO Washlet S2 TOTOTCF33320GAU (D-Shape) (Side Control) Washlet only",
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
      "variant_id": 45251862331647,
      "variant_inventory_management": "shopify",
      "variant_title": null,
      "vendor": "TOTO",
      "tax_lines": [
        {
          "channel_liable": false,
          "price": "142.64",
          "price_set": {
            "shop_money": {
              "amount": "142.64",
              "currency_code": "AUD"
            },
            "presentment_money": {
              "amount": "142.64",
              "currency_code": "AUD"
            }
          },
          "rate": 0.1,
          "title": "GST"
        }
      ],
      "duties": [],
      "discount_allocations": [
        {
          "amount": "30.00",
          "amount_set": {
            "shop_money": {
              "amount": "30.00",
              "currency_code": "AUD"
            },
            "presentment_money": {
              "amount": "30.00",
              "currency_code": "AUD"
            }
          },
          "discount_application_index": 0
        }
      ]
    }
  ],
  "payment_terms": null,
  "refunds": [],
  "shipping_address": null,
  "shipping_lines": [
    {
      "id": 5400553160959,
      "carrier_identifier": null,
      "code": "Glen Waverley Store",
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
      "title": "Glen Waverley Store",
      "tax_lines": [],
      "discount_allocations": []
    }
  ],
  "returns": [],
  "line_item_groups": []
};

const sampleShopifyOrder2 = {
  "id": 6674576638207,
  "admin_graphql_api_id": "gid://shopify/Order/6674576638207",
  "app_id": 580111,
  "browser_ip": "49.184.232.196",
  "buyer_accepts_marketing": true,
  "cancel_reason": null,
  "cancelled_at": null,
  "cart_token": "hWN8SXWxOJ1Gt5qRBHembYn6",
  "checkout_id": 38351762653439,
  "checkout_token": "63de0d6dcaf93bcbd7bd92d090a2a3ef",
  "client_details": {
    "accept_language": "en-AU",
    "browser_height": null,
    "browser_ip": "49.184.232.196",
    "browser_width": null,
    "session_hash": null,
    "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 26_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/127.1  Mobile/15E148 Safari/605.1.15"
  },
  "closed_at": null,
  "confirmation_number": "0QKE7DENP",
  "confirmed": true,
  "contact_email": "juliana.d.g1958@gmail.com",
  "created_at": "2026-02-06T16:18:47+11:00",
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
  "current_subtotal_price": "58.30",
  "current_subtotal_price_set": {
    "shop_money": {
      "amount": "58.30",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "58.30",
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
  "current_total_price": "58.30",
  "current_total_price_set": {
    "shop_money": {
      "amount": "58.30",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "58.30",
      "currency_code": "AUD"
    }
  },
  "current_total_tax": "5.30",
  "current_total_tax_set": {
    "shop_money": {
      "amount": "5.30",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "5.30",
      "currency_code": "AUD"
    }
  },
  "customer_locale": "en-AU",
  "device_id": null,
  "discount_codes": [],
  "duties_included": false,
  "email": "juliana.d.g1958@gmail.com",
  "estimated_taxes": false,
  "financial_status": "paid",
  "fulfillment_status": null,
  "landing_site": "/products/asp2112",
  "landing_site_ref": null,
  "location_id": null,
  "merchant_business_entity_id": "MTI5MzAzOTMwOTc5",
  "merchant_of_record_app_id": null,
  "name": "#BURWEB2538",
  "note": null,
  "note_attributes": [],
  "number": 1538,
  "order_number": 2538,
  "order_status_url": "https://burdensbathrooms.com.au/29303930979/orders/16d9298a9bc3d287eff9ecad80afd552/authenticate?key=4ba1822d1f05abc659f32e100e28f308",
  "original_total_additional_fees_set": null,
  "original_total_duties_set": null,
  "payment_gateway_names": [
    "shopify_payments"
  ],
  "phone": null,
  "po_number": null,
  "presentment_currency": "AUD",
  "processed_at": "2026-02-06T16:18:46+11:00",
  "reference": null,
  "referring_site": null,
  "source_identifier": null,
  "source_name": "web",
  "source_url": null,
  "subtotal_price": "58.30",
  "subtotal_price_set": {
    "shop_money": {
      "amount": "58.30",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "58.30",
      "currency_code": "AUD"
    }
  },
  "tags": "",
  "tax_exempt": false,
  "tax_lines": [
    {
      "price": "5.30",
      "rate": 0.1,
      "title": "GST",
      "price_set": {
        "shop_money": {
          "amount": "5.30",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "5.30",
          "currency_code": "AUD"
        }
      },
      "channel_liable": false
    }
  ],
  "taxes_included": true,
  "test": false,
  "token": "16d9298a9bc3d287eff9ecad80afd552",
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
  "total_line_items_price": "58.30",
  "total_line_items_price_set": {
    "shop_money": {
      "amount": "58.30",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "58.30",
      "currency_code": "AUD"
    }
  },
  "total_outstanding": "0.00",
  "total_price": "58.30",
  "total_price_set": {
    "shop_money": {
      "amount": "58.30",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "58.30",
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
  "total_tax": "5.30",
  "total_tax_set": {
    "shop_money": {
      "amount": "5.30",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "5.30",
      "currency_code": "AUD"
    }
  },
  "total_tip_received": "0.00",
  "total_weight": 0,
  "updated_at": "2026-02-06T16:18:49+11:00",
  "user_id": null,
  "billing_address": {
    "first_name": "Juliana",
    "address1": "53 Waratah Avenue",
    "phone": null,
    "city": "Belgrave",
    "zip": "3160",
    "province": "Victoria",
    "country": "Australia",
    "last_name": "De Graaf",
    "address2": null,
    "company": null,
    "latitude": -37.91787350000001,
    "longitude": 145.3600244,
    "name": "Juliana De Graaf",
    "country_code": "AU",
    "province_code": "VIC"
  },
  "customer": {
    "id": 8759486972159,
    "created_at": "2026-02-06T16:17:57+11:00",
    "updated_at": "2026-02-06T16:18:48+11:00",
    "first_name": "Juliana",
    "last_name": "De Graaf",
    "state": "disabled",
    "note": null,
    "verified_email": true,
    "multipass_identifier": null,
    "tax_exempt": false,
    "email": "juliana.d.g1958@gmail.com",
    "phone": null,
    "currency": "AUD",
    "tax_exemptions": [],
    "admin_graphql_api_id": "gid://shopify/Customer/8759486972159",
    "default_address": {
      "id": 10450438226175,
      "customer_id": 8759486972159,
      "first_name": "Juliana",
      "last_name": "De Graaf",
      "company": null,
      "address1": "53 Waratah Avenue",
      "address2": null,
      "city": "Belgrave",
      "province": "Victoria",
      "country": "Australia",
      "zip": "3160",
      "phone": null,
      "name": "Juliana De Graaf",
      "province_code": "VIC",
      "country_code": "AU",
      "country_name": "Australia",
      "default": true
    }
  },
  "discount_applications": [],
  "fulfillments": [],
  "line_items": [
    {
      "id": 16188906176767,
      "admin_graphql_api_id": "gid://shopify/LineItem/16188906176767",
      "attributed_staffs": [],
      "current_quantity": 1,
      "fulfillable_quantity": 1,
      "fulfillment_service": "manual",
      "fulfillment_status": null,
      "gift_card": false,
      "grams": 0,
      "name": "Aspire Unity **Square** Basin Mixer Chrome",
      "price": "58.30",
      "price_set": {
        "shop_money": {
          "amount": "58.30",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "58.30",
          "currency_code": "AUD"
        }
      },
      "product_exists": true,
      "product_id": 8119119479039,
      "properties": [],
      "quantity": 1,
      "requires_shipping": true,
      "sales_line_item_group_id": null,
      "sku": "ASP2112",
      "taxable": true,
      "title": "Aspire Unity **Square** Basin Mixer Chrome",
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
      "variant_id": 44087485006079,
      "variant_inventory_management": "shopify",
      "variant_title": null,
      "vendor": "Aspire",
      "tax_lines": [
        {
          "channel_liable": false,
          "price": "5.30",
          "price_set": {
            "shop_money": {
              "amount": "5.30",
              "currency_code": "AUD"
            },
            "presentment_money": {
              "amount": "5.30",
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
  "shipping_address": null,
  "shipping_lines": [
    {
      "id": 5400556110079,
      "carrier_identifier": null,
      "code": "Ferntree Gully Store",
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
      "title": "Ferntree Gully Store",
      "tax_lines": [],
      "discount_allocations": []
    }
  ],
  "returns": [],
  "line_item_groups": []
}

// Generate payload using the actual buildFrameworksPayload function from transform.service.js
console.log('🔧 Generating Frameworks payload from Shopify order...');
const payload = buildFrameworksPayload(sampleShopifyOrder1, 'burdens'); // Use 'burdens' as store for testing

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
