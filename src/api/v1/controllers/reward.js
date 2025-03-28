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
      const { userId, rewardIds,label } = data;

      const res = await strapi.service("api::reward.reward").reward({
        userId,
        rewardIds,
        label
      });

      return ctx.send({ userId, rewardIds, res }, 200);
    } catch (error) {
      console.error(error);
    }
  },
});

module.exports = controller;
