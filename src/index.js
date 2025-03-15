"use strict";

const clg = require("./lib/clg");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      // Watching NotificationX model : onCreate
      models: [
        "api::notificationx.notificationx",
        "api::shopify-coupon.shopify-coupon",
      ],
      // Called after an entry has been created
      async afterCreate(event) {
        if (
          event?.result?.channel === "mail" &&
          event.model.uid === "api::notificationx.notificationx"
        ) {
          await strapi
            .service("api::notificationx.notificationx")
            .notifyByMail(event?.result?.id);
        }
        if (event.model.uid === "api::shopify-coupon.shopify-coupon") {
          const shopifyCoupon = await strapi
            .query("api::shopify-coupon.shopify-coupon")
            .findOne({
              where: {
                id: event.result.id,
              },
              populate: {
                shopify_price_rule: true,
              },
            });
          await strapi
            .service("api::shopify-coupon.shopify-coupon")
            .generateShopifyCoupon(shopifyCoupon);
        }
      },
    });
  },
};
