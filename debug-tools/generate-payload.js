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
  "id": 6683628404991,
  "admin_graphql_api_id": "gid://shopify/Order/6683628404991",
  "app_id": 580111,
  "browser_ip": "104.28.28.29",
  "buyer_accepts_marketing": true,
  "cancel_reason": null,
  "cancelled_at": null,
  "cart_token": "hWN8ZBa3jJhBJGELK5PTOt88",
  "checkout_id": 38366943510783,
  "checkout_token": "86ffebe46c1222611baa55c4cd2ba9fc",
  "client_details": {
    "accept_language": "en-AU",
    "browser_height": null,
    "browser_ip": "104.28.28.29",
    "browser_width": null,
    "session_hash": null,
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Safari/605.1.15"
  },
  "closed_at": null,
  "confirmation_number": "82WZRE8Y6",
  "confirmed": true,
  "contact_email": "jeff@easterntradies.com.au",
  "created_at": "2026-02-09T12:07:33+11:00",
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
  "current_subtotal_price": "755.79",
  "current_subtotal_price_set": {
    "shop_money": {
      "amount": "755.79",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "755.79",
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
  "current_total_price": "755.79",
  "current_total_price_set": {
    "shop_money": {
      "amount": "755.79",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "755.79",
      "currency_code": "AUD"
    }
  },
  "current_total_tax": "68.71",
  "current_total_tax_set": {
    "shop_money": {
      "amount": "68.71",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "68.71",
      "currency_code": "AUD"
    }
  },
  "customer_locale": "en-AU",
  "device_id": null,
  "discount_codes": [],
  "duties_included": false,
  "email": "jeff@easterntradies.com.au",
  "estimated_taxes": false,
  "financial_status": "paid",
  "fulfillment_status": null,
  "landing_site": "/",
  "landing_site_ref": null,
  "location_id": null,
  "merchant_business_entity_id": "MTI5MzAzOTMwOTc5",
  "merchant_of_record_app_id": null,
  "name": "#BURWEB2542",
  "note": null,
  "note_attributes": [],
  "number": 1542,
  "order_number": 2542,
  "order_status_url": "https://burdensbathrooms.com.au/29303930979/orders/00fadedb22be2fccc5ac0fb7c025d438/authenticate?key=cb03f68e58bba51b34141cce97b9a6fa",
  "original_total_additional_fees_set": null,
  "original_total_duties_set": null,
  "payment_gateway_names": [
    "shopify_payments",
    "paypal"
  ],
  "phone": "+61414573800",
  "po_number": null,
  "presentment_currency": "AUD",
  "processed_at": "2026-02-09T12:07:31+11:00",
  "reference": null,
  "referring_site": null,
  "source_identifier": null,
  "source_name": "web",
  "source_url": null,
  "subtotal_price": "755.79",
  "subtotal_price_set": {
    "shop_money": {
      "amount": "755.79",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "755.79",
      "currency_code": "AUD"
    }
  },
  "tags": "",
  "tax_exempt": false,
  "tax_lines": [
    {
      "price": "68.71",
      "rate": 0.1,
      "title": "GST",
      "price_set": {
        "shop_money": {
          "amount": "68.71",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "68.71",
          "currency_code": "AUD"
        }
      },
      "channel_liable": false
    }
  ],
  "taxes_included": true,
  "test": false,
  "token": "00fadedb22be2fccc5ac0fb7c025d438",
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
  "total_line_items_price": "755.79",
  "total_line_items_price_set": {
    "shop_money": {
      "amount": "755.79",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "755.79",
      "currency_code": "AUD"
    }
  },
  "total_outstanding": "0.00",
  "total_price": "755.79",
  "total_price_set": {
    "shop_money": {
      "amount": "755.79",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "755.79",
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
  "total_tax": "68.71",
  "total_tax_set": {
    "shop_money": {
      "amount": "68.71",
      "currency_code": "AUD"
    },
    "presentment_money": {
      "amount": "68.71",
      "currency_code": "AUD"
    }
  },
  "total_tip_received": "0.00",
  "total_weight": 0,
  "updated_at": "2026-02-09T12:07:34+11:00",
  "user_id": null,
  "billing_address": {
    "first_name": "Jeff",
    "address1": "22 Actoal Drive",
    "phone": "+61414573800",
    "city": "Montrose",
    "zip": "3765",
    "province": "Victoria",
    "country": "Australia",
    "last_name": "Grix",
    "address2": null,
    "company": "Eastern Tradies",
    "latitude": -37.81514629999999,
    "longitude": 145.3356201,
    "name": "Jeff Grix",
    "country_code": "AU",
    "province_code": "VIC"
  },
  "customer": {
    "id": 7366277693695,
    "created_at": "2024-06-30T17:35:48+10:00",
    "updated_at": "2026-02-09T12:07:33+11:00",
    "first_name": "Jeff",
    "last_name": "Grix",
    "state": "disabled",
    "note": null,
    "verified_email": true,
    "multipass_identifier": null,
    "tax_exempt": false,
    "email": "jeff@easterntradies.com.au",
    "phone": "+61414573800",
    "currency": "AUD",
    "tax_exemptions": [],
    "admin_graphql_api_id": "gid://shopify/Customer/7366277693695",
    "default_address": {
      "id": 10458252017919,
      "customer_id": 7366277693695,
      "first_name": "Jeff",
      "last_name": "Grix",
      "company": "Eastern Tradies",
      "address1": "22 Actoal Drive",
      "address2": null,
      "city": "Montrose",
      "province": "Victoria",
      "country": "Australia",
      "zip": "3765",
      "phone": "+61414573800",
      "name": "Jeff Grix",
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
      "id": 16199202996479,
      "admin_graphql_api_id": "gid://shopify/LineItem/16199202996479",
      "attributed_staffs": [],
      "current_quantity": 5,
      "fulfillable_quantity": 5,
      "fulfillment_service": "manual",
      "fulfillment_status": null,
      "gift_card": false,
      "grams": 0,
      "name": "Mr. Wet Wall 10Mm End Cap Trim 2400Mm  White",
      "price": "15.99",
      "price_set": {
        "shop_money": {
          "amount": "15.99",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "15.99",
          "currency_code": "AUD"
        }
      },
      "product_exists": true,
      "product_id": 8119187570943,
      "properties": [],
      "quantity": 5,
      "requires_shipping": true,
      "sales_line_item_group_id": null,
      "sku": "MWW0034",
      "taxable": true,
      "title": "Mr. Wet Wall 10Mm End Cap Trim 2400Mm  White",
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
      "variant_id": 44087635149055,
      "variant_inventory_management": "shopify",
      "variant_title": null,
      "vendor": "Wet Wall",
      "tax_lines": [
        {
          "channel_liable": false,
          "price": "7.27",
          "price_set": {
            "shop_money": {
              "amount": "7.27",
              "currency_code": "AUD"
            },
            "presentment_money": {
              "amount": "7.27",
              "currency_code": "AUD"
            }
          },
          "rate": 0.1,
          "title": "GST"
        }
      ],
      "duties": [],
      "discount_allocations": []
    },
    {
      "id": 16199203029247,
      "admin_graphql_api_id": "gid://shopify/LineItem/16199203029247",
      "attributed_staffs": [],
      "current_quantity": 1,
      "fulfillable_quantity": 1,
      "fulfillment_service": "manual",
      "fulfillment_status": null,
      "gift_card": false,
      "grams": 0,
      "name": "Mr. Wet Wall 10Mm Internal Trim 2400Mm White",
      "price": "15.99",
      "price_set": {
        "shop_money": {
          "amount": "15.99",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "15.99",
          "currency_code": "AUD"
        }
      },
      "product_exists": true,
      "product_id": 8119187734783,
      "properties": [],
      "quantity": 1,
      "requires_shipping": true,
      "sales_line_item_group_id": null,
      "sku": "MWW0044",
      "taxable": true,
      "title": "Mr. Wet Wall 10Mm Internal Trim 2400Mm White",
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
      "variant_id": 44087635509503,
      "variant_inventory_management": "shopify",
      "variant_title": null,
      "vendor": "Wet Wall",
      "tax_lines": [
        {
          "channel_liable": false,
          "price": "1.45",
          "price_set": {
            "shop_money": {
              "amount": "1.45",
              "currency_code": "AUD"
            },
            "presentment_money": {
              "amount": "1.45",
              "currency_code": "AUD"
            }
          },
          "rate": 0.1,
          "title": "GST"
        }
      ],
      "duties": [],
      "discount_allocations": []
    },
    {
      "id": 16199203062015,
      "admin_graphql_api_id": "gid://shopify/LineItem/16199203062015",
      "attributed_staffs": [],
      "current_quantity": 3,
      "fulfillable_quantity": 3,
      "fulfillment_service": "manual",
      "fulfillment_status": null,
      "gift_card": false,
      "grams": 0,
      "name": "Mr Wet Wall White Carrara Marble Gloss Wall Panel 2400X1000X10Mm Wwaus001",
      "price": "219.95",
      "price_set": {
        "shop_money": {
          "amount": "219.95",
          "currency_code": "AUD"
        },
        "presentment_money": {
          "amount": "219.95",
          "currency_code": "AUD"
        }
      },
      "product_exists": true,
      "product_id": 9110066659583,
      "properties": [],
      "quantity": 3,
      "requires_shipping": true,
      "sales_line_item_group_id": null,
      "sku": "MWW0003",
      "taxable": true,
      "title": "Mr Wet Wall White Carrara Marble Gloss Wall Panel 2400X1000X10Mm Wwaus001",
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
      "variant_id": 46887575093503,
      "variant_inventory_management": "shopify",
      "variant_title": null,
      "vendor": "Wet Wall",
      "tax_lines": [
        {
          "channel_liable": false,
          "price": "59.99",
          "price_set": {
            "shop_money": {
              "amount": "59.99",
              "currency_code": "AUD"
            },
            "presentment_money": {
              "amount": "59.99",
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
      "id": 5404445343999,
      "carrier_identifier": null,
      "code": "Ringwood Store",
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
      "title": "Ringwood Store",
      "tax_lines": [],
      "discount_allocations": []
    }
  ],
  "returns": [],
  "line_item_groups": []
}

// Generate payload using the actual buildFrameworksPayload function from transform.service.js
console.log('🔧 Generating Frameworks payload from Shopify order...');
const payload = buildFrameworksPayload(sampleShopifyOrder2, 'burdens'); // Use 'burdens' as store for testing

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
