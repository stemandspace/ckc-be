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
  async getReferrals(ctx) {
    try {
      const { userId } = ctx.request.query;
      const referrals = await strapi.db
        .query("api::achivement.achivement")
        .findMany({
          where: {
            user: Number(userId),
            contentType: "referral",
          },
          orderBy: { createdAt: "desc" },
        });
      const referConfig = await strapi.entityService.findOne(
        "api::referral-config.referral-config",
        1,
        {
          populate: {
            milestones: {
              populate: {
                rewards: true,
              },
            },
          },
        }
      );
      const milestones = referConfig.milestones;
      const referralLimitPerMonth = referConfig.referralLimitPerMonth;

      const referralsThisMonth = await strapi
        .service("api::referral.referral")
        .getReferralCountForMonth(userId);

      const canMakeReferral = referralsThisMonth < referralLimitPerMonth;

      return ctx.send(
        {
          referrals,
          totalReferrals: referrals?.length,
          milestones,
          referralLimitPerMonth,
          referralsThisMonth,
          canMakeReferral,
        },
        200
      );
    } catch (error) {
      console.log(error);
    }
  },
});

module.exports = controller;
