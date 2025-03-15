"use strict";

/**
 * shopify-price-rule service
 */

const { createCoreService } = require("@strapi/strapi").factories;
const { shopifyFetchInstance } = require("../../../lib/shopifyFetchInstance");

module.exports = createCoreService(
  "api::shopify-price-rule.shopify-price-rule",
  () => ({
    async generateShopifyPriceRule(priceRule) {
      const fetchInstance = shopifyFetchInstance();
      // POST Request
      const postData = {
        price_rule: {
          title: `₹${priceRule.discount} Off Everything with ${priceRule.deductCoins} coins`,
          value_type: `${priceRule.discountType}`,
          value: -Number(priceRule.discount),
          customer_selection: "all",
          target_type: "line_item",
          target_selection: "all",
          allocation_method: "across",
          starts_at: new Date(Date.now()).toISOString(),
          usage_limit: priceRule.usage_limit
            ? Number(priceRule.usage_limit)
            : 1,
        },
      };

      const shopifyRes = await fetchInstance(
        `price_rules.json`,
        "POST",
        postData
      );
 
      await strapi.db
        .query("api::shopify-price-rule.shopify-price-rule")
        .update({
          where: { id: priceRule.id },
          data: {
            priceRuleId: `${shopifyRes.price_rule?.id}`,
            title: `₹${priceRule.discount} Off Everything with ${priceRule.deductCoins} coins`,
          },
        });
    },
  })
);
