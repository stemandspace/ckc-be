"use strict";

const LIVE_TYPE = "live";

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
  async getActiveLiveInfo(ctx) {
    try {
      const live = await strapi.query("api::live.live").findOne({
        where: {
          $and: [
            {
              type: LIVE_TYPE,
            },
            {
              publishedAt: {
                $ne: null,
              },
            },
          ],
        },
        populate: ["thumbnail"],
      });

      if (!live) {
        return ctx.badRequest("No active live found");
      }

      ctx.status = 200;
      ctx.body = live;
    } catch (err) {
      `
      console.error(err)`;
      ctx.badRequest("Error fetching active live info");
    }
  },
});

module.exports = controller;
