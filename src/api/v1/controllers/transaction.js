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
    const CREDIT = 100;
    const TYPE = "premium";

    try {
      const {
        // event,
        payload: {
          payment: {
            entity: { id, email, description, contact, notes },
          },
        },
      } = ctx.request.body.data;

      if (description !== "CKC") {
        console.log("payment description not matched!");
        return ctx.send({ ok: true }, 200);
      }

      const { user_id, plan_id, topup_id, transaction_id, type } = notes;

      if (type === "subscription") {
        // update & fetch transaction;
        const transaction = await strapi.db
          .query("api::transactions.transaction")
          .update({
            where: {
              id: transaction_id,
            },
            data: {
              status: "captured",
              razorpay_payment_id: id,
            },
          });

        const plan = await strapi.db.query("api:plans.plans").findOne({
          where: {
            id: plan_id,
          },
        });

        const end_timestamp = Math.floor(
          new Date().setDate(
            new Date().getDate() + parseInt(plan?.duration_days)
          ) / 1000
        );

        // create transaction;
        const subscription = await strapi
          .query("api::subscription.subscription")
          .create({
            data: {
              tsxid: id,
              plan: plan_id,
              title: plan_id,
              user_id: user_id,
              publishedAt: new Date(),
              end_stamp: end_timestamp,
            },
          });

        // find user details
        const user = await strapi
          .query("plugin::users-permissions.user")
          .findOne({
            where: { id: user_id },
          });

        const updatedCoins = parseInt(user.credits) + CREDIT;

        user.credits = updatedCoins;

        // update user
        await strapi.query("plugin::users-permissions.user").update({
          where: { id: user_id },
          data: {
            type: TYPE,
            credits: updatedCoins,
            premium: end_timestamp,
          },
        });
      }
      return ctx.send({ ok: true }, 200);
    } catch (error) {
      console.error(error);
    }
  },
});

module.exports = controller;
