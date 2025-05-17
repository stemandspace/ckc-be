"use strict";

const controller = ({ strapi }) => ({
  async filterDailyQuiz(ctx) {
    try {
      const { difficulty, userId } = ctx.request.query;

      if (!difficulty || !userId) {
        return ctx.send({ error: "difficulty and userId are required" }, 400);
      }

      const attempt = await strapi
        .service("api::daily-quiz.daily-quiz")
        .validateQuizAttempt(userId);

      const quiz = await strapi
        .service("api::daily-quiz.daily-quiz")
        .getQuizByDifficulty(difficulty);

      const score = await strapi
        .service("api::daily-quiz-score.daily-quiz-score")
        .getDailyQuizScore(userId);

      return ctx.send(
        {
          quiz,
          score,
          attempt,
        },
        200
      );
    } catch (err) {
      console.error(err);
      ctx.internalServerError("An error occurred during fetching daily quiz.");
    }
  },
});

module.exports = controller;
