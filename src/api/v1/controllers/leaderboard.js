const clg = require("../../../lib/clg");

/**
 * @typedef {import('@strapi/strapi').Strapi} Strapi
 * @typedef {import('koa').Context} Context
 */

/**
 * NAC custom APIs
 * @param {{ strapi: Strapi }} param0 - Strapi instance.
 * @returns {Object} Controller methods.
 */

const controller = ({ strapi }) => ({
  async globalLeaderboard(ctx) {
    try {
      const stack = await strapi
        .service("api::stack.stack")
        .getGlobalLeaderboardStack();

      if (stack) {
        clg("Returning cached leaderboard");
        return ctx.send(stack, 200);
      }

      clg("calculating leaderboard...");

      const [overall, weekly, monthly] = await Promise.all([
        strapi
          .service("api::achivement.achivement")
          .calculateGlobalLeaderboard("overall"),
        strapi
          .service("api::achivement.achivement")
          .calculateGlobalLeaderboard("weekly"),
        strapi
          .service("api::achivement.achivement")
          .calculateGlobalLeaderboard("monthly"),
      ]);

      await strapi.service("api::stack.stack").saveGlobalLeaderboardStack({
        weekly,
        overall,
        monthly,
      });

      return ctx.send(
        {
          overall,
          weekly,
          monthly,
        },
        200
      );
    } catch (err) {
      console.log(err);
      return ctx.badRequest("Error fetching leaderboard", 400);
    }
  },
});

module.exports = controller;
