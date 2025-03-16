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
  // this is creating to log in to oberserblity of any user activity in backend;
  async Logger(ctx) {
    try {
      // const { data } = ctx.request.body;

      const response = await strapi
        .service("api::promocode.promocode")
        .applyPromocode("XXXXXXXX", "7310", 1000);

      return ctx.send({ ok: true, response }, 200);
    } catch (error) {
      console.error(error);
      return ctx.send({ ok: false }, 500);
    }
  },
});

module.exports = controller;
