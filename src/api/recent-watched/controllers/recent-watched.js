"use strict";

const queryPaths = {
  video: "api::video.video",
  comic: "api::comic.comic",
  course: "api::course.course",
  live: "api::live.live",
  module: "api::course.course",
};

module.exports = {
  getRecentWached: async (ctx, next) => {
    try {
      const { id } = ctx.query;

      // Fetch recent watched items by user id
      const recentWatched = await strapi
        .query("api::watched.watched")
        .findMany({
          where: { user_id: id },
          limit: 5,
        });

      if (recentWatched.length > 0) {
        // Fetch additional details for each recent watched item
        const enrichedRecentWatched = await Promise.all(
          recentWatched.map(async (watchedItem) => {
            const contentPath = queryPaths[watchedItem.type];
            if (!contentPath) return null;

            const contentDetails =
              watchedItem.type === "module"
                ? await strapi
                    .query(contentPath)
                    .findOne({ where: { id: watchedItem.course_id } })
                : await strapi
                    .query(contentPath)
                    .findOne({ where: { id: watchedItem.content_id } });

            if (contentDetails) {
              return {
                ...watchedItem,
                contentDetails,
              };
            }
            return null;
          })
        );

        const validEnrichedRecentWatched = enrichedRecentWatched.filter(
          (item) => item !== null
        );
        if (validEnrichedRecentWatched.length > 0) {
          ctx.body = { recentWatched: validEnrichedRecentWatched };
        } else {
          ctx.body = {
            message: "No valid content details found for recent watched items.",
          };
        }
      } else {
        ctx.body = { message: "No recent watched items found." };
      }
    } catch (err) {
      ctx.body = { error: err.message || "Internal Server Error" };
    }
  },
};
