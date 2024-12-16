"use strict";

const getLikeCount = async ({ contentType, contentId, userId }, strapi) => {
  const likeCount = await strapi.query("api::like.like").count({
    where: {
      userId,
      contentId,
      type: contentType,
    },
  });
  return likeCount;
};

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
  async getLike(ctx) {
    try {
      const { contentType, contentId, userId } = ctx.request.query;
      const likeCount = await strapi.query("api::like.like").count({
        where: {
          userId,
          contentId,
          type: contentType,
        },
      });
      return ctx.send({ liked: likeCount != 0 }, 200);
    } catch (err) {
      console.error(err);
      ctx.internalServerError("An error occurred during like count.");
    }
  },

  async setLike(ctx) {
    const { contentType, contentId, userId } = ctx.request.body.data;
    if (!contentType || !contentId || !userId) {
      return ctx.badRequest(
        "Content type, content id and user id are required"
      );
    }

    const likeCount = await getLikeCount(
      {
        userId,
        contentId,
        contentType,
      },
      strapi
    );
    // we need to make like entry
    if (likeCount == 0) {
      await strapi.query("api::like.like").create({
        data: {
          userId,
          contentId,
          type: contentType,
          publishedAt: new Date(),
        },
      });
      return ctx.send({ liked: true }, 200);
    } else {
      await strapi.query("api::like.like").delete({
        where: {
          userId,
          contentId,
          type: contentType,
        },
      });
      return ctx.send({ liked: false }, 200);
    }
  },
});

module.exports = controller;
