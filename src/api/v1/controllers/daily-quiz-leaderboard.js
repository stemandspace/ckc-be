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
  async quizLeaderboard(ctx) {
    try {
      const usersScores = await strapi
        .query("api::daily-quiz-score.daily-quiz-score")
        .findMany({
          orderBy: { score: "desc" },
          populate: {
            user: {
              select: ["id", "firstname", "lastname", "avatar", "username"],
            },
          },
        });

      const dataMap = usersScores.map((sc) => {
        return {
          points: sc.score,
          id: sc.user.id,
          avatar: sc?.user?.avatar,
          lastname: sc?.user?.lastname,
          username: sc?.user?.username,
          firstname: sc?.user?.firstname,
        };
      });

      const sortedLeaderboard = Array.from(dataMap.values()).sort(
        (a, b) => b?.points - a?.points
      );
      const addRankInLeaderboard = sortedLeaderboard.map((_, index) => {
        return {
          ..._,
          rank: index + 1,
        };
      });

      return ctx.send({ data: addRankInLeaderboard }, 200);
    } catch (err) {
      console.log(err);
      return ctx.badRequest("Error fetching leaderboard", 400);
    }
  },
});

module.exports = controller;
