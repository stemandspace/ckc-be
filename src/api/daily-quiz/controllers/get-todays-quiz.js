"use strict";

const getGroupName = (grade) => {
  if (grade >= 1 && grade <= 3) {
    return "junior";
  } else if (grade >= 4 && grade <= 6) {
    return "middle";
  } else if (grade >= 7 && grade <= 9) {
    return "senior";
  }
};

const controller = ({ strapi }) => ({
  async getTodaysQuiz(ctx) {
    try {
      const { userId } = ctx.request.query;
      if (!userId) {
        return ctx.send("Please provide user id", 400);
      }

      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            id: userId,
          },
        });

      const groupName = getGroupName(user.grade);

      const todaysQuiz = await strapi.db
        .query("api::daily-quiz.daily-quiz")
        .findOne({
          where: {
            publish_date: new Date(Date.now()).toISOString(),
            group: groupName,
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
        {
          todaysQuiz,
          userGroupName: groupName,
          attempted: attempt ? true : false,
          attemptedQuizScore: attempt?.score ? attempt.score : 0,
          quizScore,
        },
        200
      );
    } catch (err) {
      console.error(err);
      ctx.internalServerError("An error occurred during get todays quiz.");
    }
  },
});

module.exports = controller;
