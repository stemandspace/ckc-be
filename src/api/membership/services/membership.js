"use strict";

/**
 * membership service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::membership.membership", () => ({
  createAfterPayment: async (payload) => {
    const membership = await strapi.db
      .query("api::membership.membership")
      .count({
        where: {
          user: payload.user,
          status: "active",
        },
      });
    await strapi.query("api::membership.membership").create({
      data: {
        ...payload,
        status: membership > 0 ? "inactive" : "active",
      },
    });
    return membership;
  },
}));
