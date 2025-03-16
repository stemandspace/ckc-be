"use strict";

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
   * Create Razorpay Order
   * @param {Context} ctx - Koa context
   * @returns {Promise<any>}
   */
  async applicable(ctx) {
    try {
      // @ts-ignore
      const { promocode, userId, price } = ctx.request.body.data;
      // validation;
      if (!promocode || !userId || !price) {
        return ctx.badRequest("Missing parameters");
      }
      // check promocode
      const promocode_res = await strapi
        .service("api::promocode.promocode")
        .applicable(promocode, userId, price);
      return ctx.send(promocode_res);
    } catch (error) {
      return ctx.badRequest("Error in promocode");
    }
  },
});

module.exports = controller;
