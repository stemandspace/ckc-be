"use strict";

const controller = ({ strapi }) => ({
  async getTodaysQuiz(ctx) {
    try {
      const { userId } = ctx.request.query;
      if (!userId) {
        return ctx.send("Please provide user id", 400);
      }
      const todaysQuiz = await strapi.db
        .query("api::daily-quiz.daily-quiz")
        .findOne({
          where: {
            publish_date: new Date(Date.now()).toISOString(),
          },
          populate: {
            questions: true,
          },
        });
      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setUTCHours(23, 59, 59, 999);
      const attempt = await strapi.db
        .query("api::daily-quiz-attemp.daily-quiz-attemp")
        .findOne({
          where: {
            user_id: userId || 0,
            publishedAt: {
              $gte: startOfDay.toISOString(),
              $lt: endOfDay.toISOString(),
            },
          },
        });
      let quizScore = await strapi.db
        .query("api::daily-quiz-score.daily-quiz-score")
        .findOne({
          where: {
            user: {
              id: userId,
            },
          },
        });
      return ctx.send(
        { todaysQuiz, attempted: attempt ? true : false, quizScore },
        200
      );
    } catch (err) {
      console.error(err);
      ctx.internalServerError("An error occurred during get todays quiz.");
    }
  },
});

module.exports = controller;
