"use strict";

const axios = require("axios");

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::notification.notification", {
  async create(ctx) {
    const response = await super.create(ctx);
    return response;
  },

  async createNotifcation(ctx) {
    try {
      // @ts-ignore
      console.log(ctx.request.body.data);
      // @ts-ignore
      const { user, title, message, type, status } = ctx.request.body.data;

      // notification type email
      if (type === "email") {
        const USER = await strapi
          .query("plugin::users-permissions.user")
          .findOne({
            where: { id: user },
          });

        await strapi.plugins["email"].services.email.send({
          to: USER.email,
          subject: title,
          text: message,
        });
      }

      await strapi.query("api::notification.notification").create({
        data: {
          user,
          type,
          title,
          status,
          message,
          publishedAt: new Date(),
        },
      });

      return ctx.send({ ok: true }, 200);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async sendMail(ctx) {
    try {
      //@ts-ignore
      const { title, html, email } = ctx.request.body.data;
      /*       await strapi.plugins["email"].services.email.send({
        to: email,
        subject: title,
        html: html,
      }); */
      const payload = {
        from: {
          address: "noreply@spacetopia.in",
        },
        to: [
          {
            email_address: {
              address: email,
              name: email,
            },
          },
        ],
        subject: title,
        htmlbody: html,
      };
      const res = await axios.post(
        "https://api.zeptomail.in/v1.1/email",
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${process.env.STEMANDSPACE_ZEPTO_MAIL_AUTHORIZATION_KEY}`,
          },
        }
      );
      //console.log("Send Zepto mail............. Response - ", res);
      return ctx.send({ ok: true }, 200);
    } catch (error) {
      console.log(error);
      ctx.throw(500, error);
    }
  },
});
