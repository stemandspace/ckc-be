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
  // POST /api/refferal/create;
  async createRefferal(ctx) {
    try {
      const { refferal, referee } = ctx.request.body;
      console.log("body", {
        refferal,
        referee,
      });
      if (!refferal || !referee) {
        ctx.status = 400;
        ctx.body = { error: "Refferal and referee are required" };
        return;
      }
      const referral = await strapi
        .service("api::refferal.refferal")
        .createRefferal(refferal, referee);
      ctx.status = 200;
      ctx.body = referral;
    } catch (error) {
      console.log(error);
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  },

  // GET /api/refferal/validate
  async validateRefferal(ctx) {
    try {
      const { referee, selected_plan } = ctx.request.body;
      console.log("body", {
        referee,
        selected_plan,
      });
      if (!referee || !selected_plan) {
        ctx.status = 400;
        ctx.body = {
          error: "Refferal, referee and selected plan are re  quired",
        };
        return;
      }
      const referral = await strapi
        .service("api::refferal.refferal")
        .validateRefferal(referee, selected_plan);
      ctx.status = 200;
      ctx.body = referral;
    } catch (error) {
      console.log(error);
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  },
});

module.exports = controller;
