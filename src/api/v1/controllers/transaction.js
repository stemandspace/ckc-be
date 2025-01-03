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
  async webhook(ctx) {
    try {
      const {
        event,
        payload: {
          payment: {
            entity: { id, email, description, contact, notes },
          },
        },
      } = ctx.request.body.data;

      console.log("WEBHOOK", {
        event,
        id,
        email,
        description,
        contact,
        notes,
      });

      if (event === "payment.captured" && description === "CKC") {
        console.log("PAYMENT ORIGIN IS VERIFIED");
      }
      // when payment is not authorized;
      console.log("PAYMENT ORIGIN IS NOT VERIFIED");
      return ctx.send({ ok: true }, 200);
    } catch (error) {
      console.error(error);
    }
  },
});

module.exports = controller;
