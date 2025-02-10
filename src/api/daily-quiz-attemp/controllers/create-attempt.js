"use strict";

const controller = ({ strapi }) => ({
  async createQuizAttempt(ctx) {
    try {
      const { score, quizId, userId } = ctx.request.body.data;

      if (!quizId || !userId) {
        return ctx.badRequest("quiz id and user id are required");
      }

      const attempt = await strapi.db
        .query("api::daily-quiz-attemp.daily-quiz-attemp")
        .findOne({
          where: {
            quiz_id: quizId,
            user_id: userId,
            createdAt: Date.now(),
          },
        });

      if (attempt) {
        await strapi.db
          .query("api::daily-quiz-attemp.daily-quiz-attemp")
          .update({
            where: {
              id: attempt.id,
            },
            data: {
              score: score ? score : 0,
            },
          });
      } else {
        await strapi.db
          .query("api::daily-quiz-attemp.daily-quiz-attemp")
          .create({
            data: {
              score: score ? score : 0,
              quiz_id: quizId,
              user_id: userId,
              publishedAt: Date.now(),
            },
          });
      }

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
              score: score ? score : 0,
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
              score: score
                ? Number(quizScore.score) + Number(score)
                : Number(quizScore.score),
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
