"use strict";

const PER_PAGE = 10;

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

  // GET /api/refferal/info
  async getRefferalInfo(ctx) {
    try {
      const { uid, page = 1, pageSize = 10 } = ctx.request.query;
      if (!uid) {
        ctx.status = 400;
        ctx.body = { error: "User ID is required" };
        return;
      }
      const refferals = await strapi
        .service("api::refferal.refferal")
        .getRefferedUserList(uid, page, pageSize);

      const info = await strapi
        .service("api::refferal.refferal")
        .getNextRewardInfo(uid);

      ctx.status = 200;
      ctx.body = {
        info,
        refferals,
      };
    } catch (error) {
      console.log(error);
    }
  },
});

module.exports = controller;
