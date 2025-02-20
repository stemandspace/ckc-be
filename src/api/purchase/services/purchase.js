const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::purchase.purchase", ({ strapi }) => ({
  // Method 1: Creating an entirely new custom service

  async unlocked({ contentType, contentId, userId }) {
    const purchase = await strapi.query("api::purchase.purchase").findOne({
      where: {
        user_id: userId,
        type: contentType,
        content_id: contentId,
      },
      select: ["content_id"],
    });
    return purchase ? purchase : undefined;
  },
}));
