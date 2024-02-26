"use strict";

/**
 * notification router
 */

// module.exports = createCoreRouter('api::notification.notification');

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/notification",
      handler: "notification.createNotifcation",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/notification",
      handler: "notification.getNotifications",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
