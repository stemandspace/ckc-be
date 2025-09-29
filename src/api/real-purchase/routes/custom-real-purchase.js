"use strict";

/**
 * custom-real-purchase router
 */

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/real-purchases/initiate",
      handler: "custom-real-purchase.initiateRealPurchase",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/real-purchases/webhook",
      handler: "custom-real-purchase.handleWebhook",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
