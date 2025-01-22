"use strict";

const controller = ({ strapi }) => ({
  async getSpinAttempt(ctx) {
    try {
      const { userId } = ctx.request.query;
      if (!userId) {
        return ctx.send("Please provide user id", 400);
      }
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setUTCHours(23, 59, 59, 999);
      const attempt = await strapi.db.query("api::spin.spin").findOne({
        where: {
          user_id: userId || 0,
          publishedAt: {
            $gte: startOfDay.toISOString(),
            $lt: endOfDay.toISOString(),
          },
        },
      });
      return ctx.send({ attempt: attempt ? false : true }, 200);
    } catch (err) {
      console.error(err);
      ctx.internalServerError("An error occurred during get attempt.");
    }
  },
});

module.exports = controller;
