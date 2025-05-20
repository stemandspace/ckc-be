"use strict";

const PAGE_SIZE = 12;
const DEFAULT_PAGE = 1;
const DEFAULT_SORT = "updatedAt:desc";
const CACHE_TTL = 3600 * 24; // 1 days

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
});

module.exports = controller;
