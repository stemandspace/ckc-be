const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::like.like", ({ strapi }) => ({
  // Method 1: Creating an entirely new custom service

  async getLikes({ contentType, contentId, userId }) {
    const likes = await strapi.query("api::like.like").count({
      where: {
        userId: userId,
        type: contentType,
        contentId: contentId,
      },
    });
    return likes ?? 0;
  },
}));
