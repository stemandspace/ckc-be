"use strict";

const controller = ({ strapi }) => ({
  async createQuizAttempt(ctx) {
    try {
      const { score, quizId, userId } = ctx.request.body.data;

      if (!score || !quizId || !userId) {
        return ctx.badRequest("Score, quiz id and user id are required");
      }

      await strapi.db.query("api::daily-quiz-attemp.daily-quiz-attemp").create({
        data: {
          score,
          quiz_id: quizId,
          user_id: userId,
          publishedAt: Date.now(),
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

      if (!quizScore) {
        quizScore = await strapi.db
          .query("api::daily-quiz-score.daily-quiz-score")
          .create({
            data: {
              score,
              user: Number(userId),
              publishedAt: Date.now(),
            },
          });
      }

      if (quizScore) {
        quizScore = await strapi.db
          .query("api::daily-quiz-score.daily-quiz-score")
          .update({
            where: {
              id: quizScore.id,
            },
            data: {
              score: Number(quizScore.score) + Number(score),
            },
          });
      }

      return ctx.send({ quizScore }, 200);
    } catch (err) {
      console.error(err);
      ctx.internalServerError("An error occurred during get todays quiz.");
    }
  },
});

module.exports = controller;
