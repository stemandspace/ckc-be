"use strict";

module.exports = {
  createNotifcation: async (ctx) => {
    try {
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
  getNotifications: async (ctx) => {
    try {
      const { user } = ctx.request.query;
      const notifications = await strapi
        .query("api::notification.notification")
        .findMany({
          where: {
            user: {
              id: user,
            },
          },
        });
      return ctx.send(notifications, 200);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
};
