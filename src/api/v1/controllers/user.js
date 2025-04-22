/**
 * @typedef {import('@strapi/strapi').Strapi} Strapi
 * @typedef {import('koa').Context} Context
 */

/**
 * @param {{ strapi: Strapi }} param0 - Strapi instance.
 * @returns {Object} Controller methods.
 */

const controller = ({ strapi }) => ({
  async uploadProfilePicture(ctx) {
    try {
      const { userId } = ctx.request.body.data;
      const { image } = ctx.request.files || {};

      if (!userId || !image) {
        return ctx.throw(400, "UserId and image are required");
      }

      const profilePicture = await strapi
        .service("api::profile-picture.profile-picture")
        .uploadProfilePicture(userId, image);

      ctx.status = 200;
      ctx.body = {
        success: true,
        data: profilePicture,
      };
    } catch (error) {
      console.error("Upload error:", error);
      ctx.throw(500, "Failed to upload profile picture");
    }
  },
});

module.exports = controller;
