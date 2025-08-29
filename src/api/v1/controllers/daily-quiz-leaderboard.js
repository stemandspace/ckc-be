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
      const response = await strapi
        .query("api::daily-quiz-score.daily-quiz-score")
        .findMany({
          orderBy: { score: "desc" },
          populate: {
            user: {
              select: ["id", "firstname", "lastname", "avatar", "username", "grade"],
            },
          },
        });

      const response_with_user = response.filter((sc) => sc.user.id !== null);

      const dataMap = response_with_user.map((sc) => {
        return {
          id: sc.user.id,
          points: sc.score,
          avatar: sc?.user?.avatar,
          lastname: sc?.user?.lastname,
          username: sc?.user?.username,
          firstname: sc?.user?.firstname,
          grade: sc?.user?.grade,
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
