"use strict";

const axios = require("axios");

/**
 * @typedef {import('@strapi/strapi').Strapi} Strapi
 * @typedef {import('koa').Context} Context
 */

/**
 * Zepto Mail API Controller
 * @param {{ strapi: Strapi }} param0 - Strapi instance.
 * @returns {Object} Controller methods.
 */
const controller = ({ strapi }) => ({
  /**
   * Send email via Zepto Mail template API
   * @param {Context} ctx - Koa context
   * @returns {Promise<any>}
   */
  async sendMail(ctx) {
    try {
      // @ts-ignore
      const payload = ctx.request.body.data || ctx.request.body;

      // Validate required fields
      if (!payload.mail_template_key) {
        return ctx.badRequest("mail_template_key is required");
      }

      if (!payload.from || !payload.from.address) {
        return ctx.badRequest("from.address is required");
      }

      if (
        !payload.to ||
        !Array.isArray(payload.to) ||
        payload.to.length === 0
      ) {
        return ctx.badRequest(
          "to array with at least one recipient is required"
        );
      }

      // Forward the payload to Zepto Mail API batch endpoint
      // Format Authorization header as: Zoho-enczapikey {api_key}
      const authKey = process.env.ZEPTO_MAIL_AUTHORIZATION_KEY;
      const authHeader = authKey?.startsWith("Zoho-enczapikey")
        ? authKey
        : `Zoho-enczapikey ${authKey}`;

      const res = await axios.post(
        "https://api.zeptomail.in/v1.1/email/template/batch",
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
        }
      );

      return ctx.send({ ok: true, data: res.data }, 200);
    } catch (error) {
      console.error(
        "Zepto Mail API Error:",
        error.response?.data || error.message
      );
      return ctx.badRequest(
        error.response?.data?.error || "Error sending email via Zepto Mail"
      );
    }
  },
});

module.exports = controller;
