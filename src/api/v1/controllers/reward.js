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
  async reward(ctx) {
    try {
      const { data } = ctx.request.body;

      // userId, rewardIds = []

      console.log("LOGGER>>", JSON.stringify(data));
      return ctx.send({ data: JSON.stringify(data) }, 200);
    } catch (error) {
      console.error(error);
    }
  },
});

module.exports = controller;
