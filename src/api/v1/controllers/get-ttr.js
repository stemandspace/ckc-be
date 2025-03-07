/**
 * @typedef {import('@strapi/strapi').Strapi} Strapi
 * @typedef {import('koa').Context} Context
 */

/**
 * NAC custom APIs
 * @param {{ strapi: Strapi }} param0 - Strapi instance.
 * @returns {Object} Controller methods.
 */
// Time Tracking Reward
const controller = ({ strapi }) => ({
  // this is creating to log in to oberserblity of any user activity in backend;
  async getTTR(ctx) {
    try {
      const { contentType, contentId, userId } = ctx.request.query;
      const timeTrackingRewards = await strapi.db
        .query("api::time-tracking-reward.time-tracking-reward")
        .findMany({
          where: {
            contentType,
            contentId,
          },
          populate: {
            reward: true,
          },
        });
      const fTTR = timeTrackingRewards.filter((ttr) => ttr.reward !== null);
      if (fTTR.length === 0) {
        return ctx.send({ timeTrackingRewards: [] }, 200);
      }
      const rewards = fTTR.map((ttr) => {
        return ttr.reward;
      });
      const rewardIds = rewards.map((reward) => (reward?.id ? reward.id : 0));
      const availableAchievements = await strapi.db
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
      const flatterAvailableAchievementRewardId =
        availableAchievements.map((a) => Number(a.rewardId));
      const unavailableAchievementRewardIds = rewardIds.filter((rewardId) => {
        return !flatterAvailableAchievementRewardId.includes(rewardId);
      });

      const TTR = fTTR.filter((ttr) =>
        unavailableAchievementRewardIds.includes(ttr.reward.id)
      );

      return ctx.send(
        {
          timeTrackingRewards: TTR,
        },
        200
      );
    } catch (error) {
      console.log(error);
    }
  },
});

module.exports = controller;
