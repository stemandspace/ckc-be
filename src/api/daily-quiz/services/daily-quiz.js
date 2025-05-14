"use strict";

/**
 * daily-quiz service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::daily-quiz.daily-quiz", () => ({
  // get quiz by difficuly
  getQuizByDifficulty: async (difficulty) => {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    const todaysQuiz = await strapi.db
      .query("api::daily-quiz.daily-quiz")
      .findOne({
        where: {
          publish_date: {
            $gte: startOfDay.toISOString(),
            $lt: endOfDay.toISOString(),
          },
          difficulty,
        },
        populate: {
          questions: true,
        },
      });
    return todaysQuiz;
  },

  // validate quiz attemp
  validateQuizAttemp: async (userId) => {
    if (!userId) {
      throw new Error("userId is required");
    }
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
    return !!attempt;
  },
}));
