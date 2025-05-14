"use strict";

/**
 * daily-quiz service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::daily-quiz.daily-quiz", () => ({
  // get quiz by difficulty - max 1
  getQuizByDifficulty: async (difficulty) => {
    const publish_date = new Date(Date.now()).toISOString();
    const quiz = await strapi.db.query("api::daily-quiz.daily-quiz").findOne({
      where: {
        publish_date,
        difficulty,
      },
      populate: {
        questions: true,
      },
    });

    // validate length
    if (quiz.questions.length == 0) {
      return null;
    }
    return quiz;
  },

  // validate quiz attempt
  validateQuizAttempt: async (userId) => {
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
