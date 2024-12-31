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
  async createTransaction(ctx) {
    try {
      const { data } = ctx.request.body;
      const order = await strapi
        .service("api::transaction.transaction")
        .initiateTransection({
          ...data,
        });
      return ctx.send({ order }, 200);
    } catch (error) {
      console.error(error);
    }
  },
});

module.exports = controller;
