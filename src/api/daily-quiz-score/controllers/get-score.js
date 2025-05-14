"use strict";

const controller = ({ strapi }) => ({
  async getScore(ctx) {
    try {
      const { userId } = ctx.request.query;
      if (!userId) {
        return ctx.send("Please provide user id", 400);
      }
      const score = await strapi
        .service("api::daily-quiz-score.daily-quiz-score")
        .getDailyQuizScore(userId);
      return ctx.send({ score }, 200);
    } catch (err) {
      console.error(err);
      ctx.internalServerError("An error occurred during get todays quiz.");
    }
  },
});

module.exports = controller;
