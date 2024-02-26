"use strict";
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
});
