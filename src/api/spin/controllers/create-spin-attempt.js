"use strict";

const controller = ({ strapi }) => ({
  async createQuizAttempt(ctx) {
    try {
      // tip : rewardId is sliceId
      const { rewardId, userId } = ctx.request.body.data;

      // validate
      if (!rewardId || !userId) {
        return ctx.badRequest("reward id and user id are required");
      }

      // first create spin attempt for today
      await strapi.db.query("api::spin.spin").create({
        data: {
          user_id: userId,
          reward_id: rewardId,
          publishedAt: Date.now(),
        },
      });

      // get daily spin-config
      const spinConfig = await strapi.db
        .query("api::daily-spin.daily-spin")
        .findOne({
          populate: {
            slices: true,
          },
        });

      const slices = spinConfig.slices;

      const selectedSlice = slices.find(
        (slice) => Number(slice.id) === Number(rewardId)
      );

      if (!selectedSlice) {
        return ctx.badRequest("Invalid reward ID - slice not found.");
      }

      let user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            id: Number(userId),
          },
        });

      let achievementPayload = {
        user: Number(userId),
        transectionType: "dr",
        publishedAt: Date.now(),
        rewardId: selectedSlice.id,
        contentType: selectedSlice.type,
        label: `You win ${selectedSlice.value} ${selectedSlice.type}`,
      };

      let userPayload = {};

      switch (selectedSlice.type) {
        case "coin":
          userPayload = {
            coins: user.coins
              ? Number(user.coins) + Number(selectedSlice.value)
              : Number(selectedSlice.value),
          };

          await strapi.db.query("plugin::users-permissions.user").update({
            where: {
              id: Number(user.id),
            },
            data: userPayload,
          });
          break;
        case "credit":
          userPayload = {
            credits: user.credits
              ? Number(user.credits) + Number(selectedSlice.value)
              : Number(selectedSlice.value),
          };

          await strapi.db.query("plugin::users-permissions.user").update({
            where: {
              id: Number(user.id),
            },
            data: userPayload,
          });

          break;
        case "systemPromocode":
          achievementPayload = {
            ...achievementPayload,
            contentId: selectedSlice.value, // This is the ID for the system promo code
          };

          await strapi.db.query("api::promocode.promocode").update({
            where: { id: selectedSlice.value },
            data: {
              users: {
                connect: [{ id: Number(userId) }],
              },
            },
          });
          break;
      }

      const achievement = await strapi.db
        .query("api::achivement.achivement")
        .create({
          data: achievementPayload,
        });

      return ctx.send(
        {
          ok: true,
          data: {
            achievement,
          },
        },
        200
      );
    } catch (err) {
      console.error(err);
      ctx.internalServerError(
        "An error occurred during spin attempt creation."
      );
    }
  },
});

module.exports = controller;
