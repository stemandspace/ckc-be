"use strict";
const clg = require("../../../lib/clg");
/**
 * notificationx service
 */
const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::notificationx.notificationx", () => ({
  // it will take notificationX id and notify user by mail
  notifyByMail: async (id) => {
    clg("notifyByMail", id);
    try {
      const query = {
        where: { id: id },
        populate: {
          user: {
            feilds: ["email"],
          },
          mail_template: true,
        },
      };
      const notification = await strapi.db
        .query("api::notificationx.notificationx")
        .findOne(query);
      clg("notifyByMail Response", notification);
      return notification;
    } catch (error) {
      console.log("error", error);
    }
  },
}));

// {
//   id: 15,
//   channel: 'mail',
//   subject: 'sdfds',
//   body: 'fsdfsdf',
//   variables: null,
//   createdAt: '2025-03-04T07:27:45.234Z',
//   updatedAt: '2025-03-04T07:27:45.234Z',
//   publishedAt: null,
//   user: null,
//   mail_template: {
//     id: 1,
//     subject: 'your request has been sucesssfully accepts & rewarded',
//     body: 'body text goes here\n',
//     variables: {
//       to: 'deepakvish7354@gmail.com',
//       discovery_jar_title: 'this is discovery jar title'
//     },
//     template: {
//       id: '2518b.5ca07f11c3f3c129.k1.0edde191-f8c6-11ef-bc61-525400b0b0f3.1955ff2c625',
//       name: 'template_name'
//     },
//     label: 'testing 1',
//     createdAt: '2025-03-04T06:55:15.031Z',
//     updatedAt: '2025-03-04T06:59:12.542Z',
//     publishedAt: '2025-03-04T06:55:18.689Z'
//   }
// }
