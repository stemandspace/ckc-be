"use strict";

/**
 * reward service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::reward.reward", () => ({
  // reward to user achievement;
  reward: async ({ userId, rewardIds = [] }) => {
    try {
      //   const promises = rewardIds.map(async (rewardId) => {});
    } catch (error) {
      console.error(error);
    }
  },
}));
