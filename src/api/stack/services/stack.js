"use strict";

/**
 * stack service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::stack.stack", () => ({
  saveGlobalLeaderboardStack: async (
    data = {
      weekly: [],
      overall: [],
      monthly: [],
    }
  ) => {
    try {
      await strapi.db.query("api::stack.stack").create({
        data: {
          stackDate: new Date(),
          data: data,
        },
      });

      return true;
    } catch (err) {
      console.log(err);
    }
  },
}));
