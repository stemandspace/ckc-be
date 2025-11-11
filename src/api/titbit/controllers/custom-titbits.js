"use strict";

const PAGE_SIZE = 12;
const DEFAULT_PAGE = 1;
const DEFAULT_SORT = "updatedAt:desc";
const CACHE_TTL = 3600 * 24; // 1 days

const createPostsService = require("../services/posts");

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
  async getTitbitsCategories(ctx) {
    try {
      // we need to also implement radis for cache

      // const cacheKey = "titbits-categories";

      // const cachedData = await strapi.plugins[
      //   "rest-cache"
      // ].services.cacheStore.get(cacheKey);

      // if (cachedData) {
      //   ctx.body = cachedData;
      //   return;
      // }
      const categories = await strapi.entityService.findMany(
        "api::titbits-category.titbits-category",
        {
          publicationState: "live",
          fields: ["id", "title"],
          sort: [DEFAULT_SORT],
        }
      );
      // await strapi.plugins["rest-cache"].services.cacheStore.set(
      //   cacheKey,
      //   categories,
      //   CACHE_TTL
      // );
      ctx.body = categories;
    } catch (error) {
      console.error(error);
      ctx.badRequest("Error fetching titbits categories");
    }
  },

  /**
   * Fetch content based on type and user with pagination and purchase status.
   * @param {Context} ctx - Koa context object.
   */
  async getTitbitsByCategory(ctx) {
    try {
      const {
        id,
        page = DEFAULT_PAGE,
        pageSize = PAGE_SIZE,
      } = ctx.request.query;

      // const cacheKey = `titbits-by-category-${id}-${page}-${pageSize}`;

      // const cachedData = await strapi.plugins[
      //   "rest-cache"
      // ].services.cacheStore.get(cacheKey);

      // if (cachedData) {
      //   ctx.body = cachedData;
      //   return;
      // }

      const titbits = await strapi.entityService.findMany(
        "api::titbit.titbit",
        {
          filters: {
            //@ts-ignore
            titbits_category: id,
          },
          sort: [DEFAULT_SORT],
          populate: {
            media: {
              fields: [
                "url",
                "name",
                "width",
                "height",
                "caption",
                "formats",
                "alternativeText",
              ],
            },
          },
          publicationState: "live",
          pagination: {
            page,
            pageSize,
          },
        }
      );

      // await strapi.plugins["rest-cache"].services.cacheStore.set(
      //   cacheKey,
      //   titbits,
      //   CACHE_TTL
      // );
      ctx.body = titbits;
    } catch (error) {
      console.error(error);
      ctx.badRequest("Error fetching titbits by category");
    }
  },

  async getTitbitById(ctx) {
    try {
      const { id } = ctx.request.query;

      const titbit = await strapi.entityService.findOne(
        "api::titbit.titbit",
        id,
        {
          populate: {
            media: {
              fields: [
                "url",
                "name",
                "alternativeText",
                "caption",
                "width",
                "height",
                "formats",
              ],
            },
          },
        }
      );

      ctx.body = titbit;
    } catch (error) {
      console.error(error);
      ctx.badRequest("Error fetching titbit by id");
    }
  },

  /**
   * Fetch all titbits posts ordered by recently uploaded with pagination.
   * @param {Context} ctx - Koa context object.
   */
  async getTitbitsPosts(ctx) {
    try {
      const { page = DEFAULT_PAGE, userId } = ctx.request.query;

      const postsService = createPostsService({ strapi });
      const userIdNum = userId ? parseInt(userId.toString(), 10) : null;
      const titbits = await postsService.getTitbitsPosts(page, userIdNum);

      ctx.body = titbits;
    } catch (error) {
      console.error(error);
      ctx.badRequest("Error fetching titbits posts");
    }
  },

  /**
   * Fetch a specific titbit post by ID with like count and media.
   * @param {Context} ctx - Koa context object.
   */
  async getTitbitPost(ctx) {
    try {
      const { id } = ctx.params;
      const { userId } = ctx.request.query;

      if (!id) {
        return ctx.badRequest("Post ID is required");
      }

      const postsService = createPostsService({ strapi });
      const postId = parseInt(id.toString(), 10);
      const userIdNum = userId ? parseInt(userId.toString(), 10) : null;
      const post = await postsService.getTitbitPost(postId, userIdNum);

      if (!post) {
        return ctx.notFound("Post not found");
      }

      ctx.body = post;
    } catch (error) {
      console.error(error);
      ctx.badRequest("Error fetching titbit post");
    }
  },
});

module.exports = controller;
