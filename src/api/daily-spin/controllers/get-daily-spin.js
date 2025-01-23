"use strict";

const controller = ({ strapi }) => ({
  async getDailySpin(ctx) {
    try {
      const dailySpin = await strapi.db
        .query("api::daily-spin.daily-spin")
        .findOne({
          populate: {
            slices: true,
          },
        });
      return ctx.send({ dailySpin }, 200);
    } catch (err) {
      console.error(err);
      ctx.internalServerError("An error occurred during get daily spin.");
    }
  },
});

module.exports = controller;
