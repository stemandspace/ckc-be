"use strict";

const { shopifyFetchInstance } = require("../../../lib/shopifyFetchInstance");

/**
 * shopify-coupon service
 */
function generateCouponCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::shopify-coupon.shopify-coupon",
  () => ({
    async generateShopifyCoupon(shopifyCoupon) {
      const code = generateCouponCode();
      const fetchInstance = shopifyFetchInstance();
      const priceRuleId = shopifyCoupon.shopify_price_rule.priceRuleId;
      const selectedPriceRule = shopifyCoupon.shopify_price_rule;
      const usage_limit = shopifyCoupon.shopify_price_rule.usage_limit;

      // POST Request
      const postData = {
        discount_code: {
          code,
          usage_limit: Number(usage_limit),
        },
      };

      const shopifyRes = await fetchInstance(
        `price_rules/${priceRuleId}/discount_codes.json`,
        "POST",
        postData
      );
      await strapi.db.query("api::shopify-coupon.shopify-coupon").update({
        where: { id: shopifyCoupon.id },
        data: {
          code,
          oneTime: Number(usage_limit) === 1 ? true : false,
          start: new Date(Date.now()).toISOString(),
          title: `Coupon code for ₹${selectedPriceRule.discount} Discount`,
          discount: selectedPriceRule.discount.toString(),
          discountType: selectedPriceRule.discountType,
          configuration: JSON.stringify(shopifyRes),
        },
      });
    },
  })
);
