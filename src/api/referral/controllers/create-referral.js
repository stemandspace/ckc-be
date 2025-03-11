const controller = ({ strapi }) => ({
  async createReferral(ctx) {
    const CREDIT = 10;

    try {
      const { refId, userId } = ctx.request.body.data;
      if (!refId || !userId) {
        ctx.send({ error: "Please provide refId and userId" });
      }
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
      const referralLimitPerMonth = referConfig.referralLimitPerMonth;
      const referralsThisMonth = await strapi
        .service("api::referral.referral")
        .getReferralCountForMonth(userId);

      const canMakeReferral = referralsThisMonth < referralLimitPerMonth;
      if (!canMakeReferral) {
        return ctx.send({ ok: true, message: "monthly refer limit over" }, 200);
      }
      // create referral
      const referral = await strapi.query("api::referral.referral").create({
        data: {
          referring_user_id: Number(userId), // referring to
          referred_user_id: Number(refId), // referred by
          publishedAt: new Date(),
        },
      });

      await strapi.query("api::achivement.achivement").create({
        data: {
          user: Number(refId),
          contentId: referral.id.toString(),
          transectionAmount: CREDIT,
          transectionType: "dr",
          contentType: "referral",
          label: `${CREDIT} credits earn by refer`,
          publishedAt: new Date(),
        },
      });

      // find user details
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: Number(refId) },
        });
      const updatedCoins = parseInt(user.credits) + CREDIT;

      user.credits = updatedCoins;

      // update user
      await strapi.query("plugin::users-permissions.user").update({
        where: { id: Number(refId) },
        data: {
          credits: updatedCoins,
        },
      });
      return ctx.send({ ok: true }, 200);
    } catch (error) {
      console.error(error);
    }
  },
});

module.exports = controller;
