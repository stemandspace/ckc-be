"use strict";

/**
 * daily-quiz-score service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::daily-quiz-score.daily-quiz-score",
  () => ({
    getDailyQuizScore: async (userId) => {
      if (!userId) {
        throw new Error("userId is required");
      }
      const quizScore = await strapi.db
        .query("api::daily-quiz-score.daily-quiz-score")
        .findOne({
          where: {
            user: {
              id: userId,
            },
          },
        });
      return quizScore ? quizScore?.score ?? 0 : 0;
    },
  })
);
