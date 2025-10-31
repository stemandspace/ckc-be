"use strict";

const clg = require("../../../lib/clg");

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
          data: data,
          stackDate: new Date(),
          identifier: "globalleaderboard",
        },
      });

      return true;
    } catch (err) {
      console.log(err);
    }
  },

  async getGlobalLeaderboardStack() {
    try {
      const stack = await strapi.db.query("api::stack.stack").findOne({
        where: {
          stackDate: new Date(),
          identifier: "globalleaderboard",
        },
      });
      // clg("Leaderboard Cached Data ->", stack);
      return stack?.data ?? undefined;
    } catch (err) {
      console.log(err);
    }
  },
}));
