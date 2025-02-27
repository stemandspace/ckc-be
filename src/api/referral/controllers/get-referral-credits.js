const controller = ({ strapi }) => ({
  async getRefCredit(ctx) {
    const CREDIT = 10;

    try {
      const { userId } = ctx.request.body.data;
      if (!userId) {
        return ctx.send({ error: "Please provide refId and userId" });
      }

      // Check if referral already exists
      const existingReferral = await strapi
        .query("api::referral.referral")
        .findOne({
          where: {
            referring_user_id: Number(userId),
          },
        });

      if (existingReferral) {
        await strapi.query("api::achivement.achivement").create({
          data: {
            user: Number(existingReferral?.referred_user_id),
            contentId: existingReferral.id.toString(),
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
            where: { id: Number(existingReferral?.referred_user_id) },
          });
        const updatedCoins = parseInt(user.credits) + CREDIT;

        // update user
        await strapi.query("plugin::users-permissions.user").update({
          where: { id: Number(existingReferral?.referred_user_id) },
          data: {
            credits: updatedCoins,
          },
        });
      }
      return ctx.send({ ok: true ,existingReferral}, 200);
    } catch (error) {
      console.error(error);
      return ctx.send(
        { error: "An error occurred while processing the referral" },
        500
      );
    }
  },
});

module.exports = controller;
