"use strict";

const { SendZeptoMail } = require("../../../lib/send-mail");
/**
 * reward service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::reward.reward", () => ({
  // reward to user achievement;
  reward: async ({ userId, rewardIds = [], type, contentId }) => {
    try {
      const availableRewardId = await strapi.db
        .query("api::achivement.achivement")
        .findMany({
          where: {
            user: Number(userId),
            rewardId: {
              $in: rewardIds,
            },
          },
          select: ["rewardId"],
        });

      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: Number(userId) },
          select: ["firstname", "lastname", "email"],
        });

      const flatterRewardId = availableRewardId.map((a) => Number(a.rewardId));
      const unavailableRewardIds = rewardIds.filter((rewardId) => {
        return !flatterRewardId.includes(rewardId);
      });
      let totalCoins = 0;
      const promises = unavailableRewardIds.map(async (rewardId) => {
        const reward = await strapi.db.query("api::reward.reward").findOne({
          where: {
            id: rewardId,
          },
        });
        if (reward.type === "coins") {
          totalCoins += Number(reward.value);
        }
        const payload = {
          user: Number(userId),
          rewardId: rewardId,
          contentType: type ? type : reward.type,
          transectionAmount: reward.value ? reward.value : "0",
          transectionType: "dr",
          label: "Challenge Reward",
          publishedAt: new Date(),
          contentId: contentId ? contentId : null,
        };
        await strapi.service("api::reward.reward").updateCoins({
          userId,
          coins: totalCoins,
        });

        const achievement = await strapi.db
          .query("api::achivement.achivement")
          .create({
            data: { ...payload },
          });
        return { achievement, reward, user };
      });
      const res = await Promise.all(promises);
      return res;
    } catch (error) {
      console.error(error);
    }
  },

  updateCoins: async ({ userId, coins }) => {
    try {
      const us = await strapi.query("plugin::users-permissions.user").findOne({
        where: { id: Number(userId) },
        select: ["coins"],
      });
      const vl = coins ? Number(coins) : 0;
      const updatedCoins = parseInt(us.coins) + vl;
      await strapi.query("plugin::users-permissions.user").update({
        where: { id: Number(userId) },
        data: {
          coins: `${updatedCoins}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
}));
