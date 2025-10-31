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
              select: [
                "id",
                "firstname",
                "lastname",
                "avatar",
                "username",
                "grade",
              ],
              populate: {
                profile_picture: {
                  populate: {
                    image: true,
                  },
                },
              },
            },
          },
        });

      const response_with_user = response.filter((sc) => sc.user.id !== null);

      const dataMap = response_with_user.map((sc) => {
        // Implement fallback logic: profile_picture → avatar → default image
        const defaultImageUrl =
          "https://s3.us-east-1.amazonaws.com/myckc/myckc/thumbnail_icon_7797704_640_bb50e52cbd.png?updatedAt=2025-10-06T05%3A01%3A03.127Z";

        const profilePictureUrl =
          sc?.user?.profile_picture?.image?.formats?.small?.url ??
          sc?.user?.profile_picture?.image?.url ??
          null;

        const avatarUrl = sc?.user?.avatar;

        // Determine the final image URL with fallback logic
        const finalImageUrl = profilePictureUrl || avatarUrl || defaultImageUrl;

        return {
          id: sc.user.id,
          points: sc.score,
          avatar: finalImageUrl,
          grade: sc?.user?.grade ?? "1",
          username: sc?.user?.username,
          lastname: sc?.user?.lastname ?? "user",
          firstname: sc?.user?.firstname ?? "spacetopia",
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
