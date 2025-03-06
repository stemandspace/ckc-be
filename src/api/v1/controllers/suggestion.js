/**
 * @typedef {import('@strapi/strapi').Strapi} Strapi
 * @typedef {import('koa').Context} Context
 */

const clg = require("../../../lib/clg");

const contentTypeMap = {
  video: "api::video.video",
  comic: "api::comic.comic",
  nac: "api::nac.nac",
  live: "api::live.live",
  course: "api::course.course",
};

/**
 * NAC custom APIs
 * @param {{ strapi: Strapi }} param0 - Strapi instance.
 * @returns {Object} Controller methods.
 */

const controller = ({ strapi }) => ({
  // this is creating to log in to oberserblity of any user activity in backend;
  async getSuggestion(ctx) {
    try {
      const { contentType, contentId } = ctx.request.query;

      // validation
      if (!contentType || !contentId) {
        return ctx.badRequest("Content type and content id are required");
      }

      // contentType validation
      if (Object.keys(contentTypeMap).indexOf(contentType) === -1) {
        return ctx.badRequest("Content type is not valid");
      }

      const uid = contentTypeMap[contentType];

      const content = await strapi.query(uid).findOne({
        where: {
          id: contentId,
        },
        select: ["tags"],
      });
      clg("content", content);
      const tags = content.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (tags.length === 0) {
        return ctx.send({ data: [] }, 200);
      }

      // Build OR conditions for partial match on each tag using ILIKE (PostgreSQL case-insensitive search)
      const tagConditions = tags.map((tag) => ({
        tags: { $containsi: tag }, // $containsi is case-insensitive in Strapi v4
      }));

      const suggestions = await strapi.query(uid).findMany({
        where: {
          $or: tagConditions,
          id: { $ne: contentId }, // exclude the current content
        },
        select: ["title", "price", "grade"],
        populate: {
          thumbnail: {
            select: ["url"],
          },
        },
        limit: 5,
      });
      clg("suggestions", suggestions);
      return ctx.send({ data: suggestions }, 200);
    } catch (error) {
      console.error(error);
      return ctx.badRequest("Something went wrong");
    }
  },
});

module.exports = controller;
