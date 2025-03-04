"use strict";

/**
 * reward service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::reward.reward", () => ({
  // reward to user achievement;
  reward: async ({ userId, rewardIds = [] }) => {
    try {
      const availableRewardId = await strapi.db
        .query("api::achievement.achievement")
        .findMany({
          where: {
            userId,
            $in: rewardIds,
          },
          select: ["rewardId"],
        });
      const flatterRewardId = availableRewardId.map((a) => a.rewardId);

      const unavailableRewardIds = rewardIds.filter((rewardId) => {
        return !flatterRewardId.includes(rewardId);
      });

      const promises = unavailableRewardIds.map(async (rewardId) => {
        const reward = await strapi.db.query("api::reward.reward").findOne({
          where: {
            id: rewardId,
          },
        });

        console.log(reward);

        // const achievement = await strapi.db
        //   .query("api::achievement.achievement")
        //   .create({
        //     data: {
        //       publishedAt: new Date(),
        //     },
        //   });
      });

      await Promise.all(promises);

      // const promises = rewardIds.map(async (rewardId) => {
      //   // check karo available hai ki nhi
      //   const rewarded = strapi.db.query("api::achievement.achievement").count({
      //     where: {
      //       rewardId,
      //     },
      //   });

      //   if (rewarded) {
      //     return;
      //   }

      //   // reward fetch
      //   const reward = await strapi.db.query("api::reward.reward").findOne({
      //     where: {
      //       id: rewardId,
      //     },
      //   });

      //   const achievement = await strapi.db
      //     .query("api::achievement.achievement")
      //     .create({
      //       rewardId,
      //       userId,
      //     });
      // });

      //   const promises = rewardIds.map(async (rewardId) => {});
    } catch (error) {
      console.error(error);
    }
  },
}));
