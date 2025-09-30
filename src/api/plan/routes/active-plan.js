"use strict";

/**
 * active-plan router
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/plans/active",
      handler: "active-plan.getActivePlan",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
