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
  async getAchievements(ctx) {
    try {
      const { userId } = ctx.request.query;
      const achievements = await strapi.db
        .query("api::achivement.achivement")
        .findMany({
          where: {
            user: Number(userId),
            contentType: {
              $in: [
                "quiz",
                "banner",
                "avatar",
                "certificate",
                "badge",
                "coins",
                "bannar",
                "referral",
                "credit",
                "marketplacePromocode",
                "systemPromocode",
              ],
            },
          },
          orderBy: { createdAt: "desc" },
        });
      const populateAchievementsReward = await Promise.all(
        achievements.map(async (achivement) => {
          if (achivement?.rewardId) {
            const reward = await strapi.db.query("api::reward.reward").findOne({
              where: {
                id: Number(achivement.rewardId),
              },
              populate: {
                marketplace_promocode: {
                  populate: {
                    shopify_price_rule: true,
                  },
                },
                system_promocode: true,
                badge: {
                  populate: {
                    media: true,
                  },
                },
                avatar: {
                  populate: {
                    media: true,
                  },
                },
                certificate: {
                  populate: {
                    media: true,
                  },
                },
                bannar: {
                  populate: {
                    media: true,
                  },
                },
              },
            });
            return { ...achivement, reward };
          }
          return achivement;
        })
      );
      const categorizedAchievements = {
        quiz: [],
        avatar: [],
        certificate: [],
        badge: [],
        coins: [],
        bannar: [],
        referral: [],
        credit: [],
        marketplacePromocode: [],
        systemPromocode: [],
      };

      // Populate the categorized achievements
      populateAchievementsReward.forEach((achievement) => {
        const type = achievement.contentType;
        if (categorizedAchievements[type]) {
          categorizedAchievements[type].push(achievement);
        }
      });
      return ctx.send(
        {
          categorizedAchievements,
        },
        200
      );
    } catch (error) {
      console.log(error);
    }
  },
});

module.exports = controller;
