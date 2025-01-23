"use strict";

const controller = ({ strapi }) => ({
  async createQuizAttempt(ctx) {
    try {
      const { rewardId, userId } = ctx.request.body.data;

      if (!rewardId || !userId) {
        return ctx.badRequest("reward id and user id are required");
      }

      await strapi.db.query("api::spin.spin").create({
        data: {
          reward_id: rewardId,
          user_id: userId,
          publishedAt: Date.now(),
        },
      });
      const dailySpin = await strapi.db
        .query("api::daily-spin.daily-spin")
        .findOne({
          populate: {
            slices: true,
          },
        });
      const slices = dailySpin.slices;
      const winSlice = slices.find(
        (slice) => Number(slice.id) === Number(rewardId)
      );
      let user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            id: Number(userId),
          },
        });
      if (user && winSlice.type !== "empty") {
        const data =
          winSlice.type === "coin"
            ? {
                coins: user.coins
                  ? Number(user.coins) + Number(winSlice.value)
                  : Number(winSlice.value),
              }
            : {
                credits: user.credits
                  ? Number(user.credits) + Number(winSlice.value)
                  : Number(winSlice.value),
              };

        await strapi.db.query("api::achivement.achivement").create({
          data: {
            rewardId: winSlice.id,
            user: Number(userId),
            contentType: winSlice.type === "coin" ? "coins" : "credits",
            publishedAt: Date.now(),
            label: `You win ${winSlice.value} ${winSlice.type}`,
          },
        });

        user = await strapi.db.query("plugin::users-permissions.user").update({
          where: {
            id: Number(user.id),
          },
          data,
        });
      }

      return ctx.send({ user, winSlice }, 200);
    } catch (err) {
      console.error(err);
      ctx.internalServerError("An error occurred during get todays quiz.");
    }
  },
});

module.exports = controller;
