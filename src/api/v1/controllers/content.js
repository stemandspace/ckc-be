"use strict";

const PAGE_SIZE = 12;
const DEFAULT_PAGE = 1;

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
  /**
   * Fetch content based on type and user with pagination and purchase status.
   * @param {Context} ctx - Koa context object.
   */
  async getContent(ctx) {
    const { type, user, page = DEFAULT_PAGE } = ctx.request.query;

    // Check if type and user are provided
    if (!type || !user) {
      return ctx.badRequest(
        "Both 'type' and 'user' query parameters are required."
      );
    }

    // Check if type is valid
    const contentInfo = information[type];
    if (!contentInfo) {
      return ctx.badRequest(
        "Invalid 'type' parameter. Must be 'course' or 'comic'."
      );
    }

    const { collection_name } = contentInfo;

    try {
      // Fetch content data with pagination
      const { results, pagination } = await strapi
        .query(collection_name)
        .findPage({
          populate: ["thumbnail"],
          page: parseInt(page.toString(), 10),
          pageSize: PAGE_SIZE,
        });

      // Fetch user's purchases for the relevant content
      const contentIds = results.map((content) => content.id);
      const purchases = await strapi.query("api::purchase.purchase").findMany({
        where: {
          content_id: { $in: contentIds },
          type,
          user_id: user,
        },
        select: ["content_id"],
      });

      // Map purchases to content IDs
      const purchasedContentIds = new Set(
        purchases.map((purchase) => purchase.content_id)
      );

      // Map the content to include purchase status and thumbnail URL
      const finalResponse = results.map((content) => {
        const thumbnailUrl = content?.thumbnail?.[0]?.formats?.small?.url ?? ""; // Safely access the thumbnail URL
        return {
          ...content,
          thumbnail: thumbnailUrl,
          unlocked: purchasedContentIds.has(content.id.toString()),
        };
      });
      // Send response with content and pagination metadata
      return ctx.send({ finalResponse, pagination }, 200);
    } catch (err) {
      console.error(err);
      return ctx.internalServerError(
        "An error occurred while fetching the content."
      );
    }
  },
});

const information = {
  course: {
    collection_name: "api::course.course",
  },
  comic: {
    collection_name: "api::comic.comic",
  },
  video: {
    collection_name: "api::video.video",
  },
  nac: {
    collection_name: "api::nac.nac",
  },
  live: {
    collection_name: "api::nac.nac",
  },
};

module.exports = controller;
