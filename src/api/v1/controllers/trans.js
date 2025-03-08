"use strict";

const rz = require("../../../rz");
const clg = require("../../../lib/clg");

const getNextYearTodayDate = () => {
  const today = new Date();
  return new Date(today.setFullYear(today.getFullYear() + 1));
};

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
  /**
   * Create Razorpay Order
   * @param {Context} ctx - Koa context
   * @returns {Promise<any>}
   */
  async createRzOrder(ctx) {
    // const TRX = await strapi.db.connection.transaction();
    try {
      // @ts-ignore
      const { type, planId, topupId, userId } = ctx.request.body.data;

      // @ts-ignore
      clg("Request body:", ctx.request.body.data);

      if (
        !type ||
        !userId ||
        (type === "subscription" && !planId) ||
        (type === "credits" && !topupId)
      ) {
        return ctx.badRequest("Missing parameters");
      }

      const isSubscription = type === "subscription";
      const dataSource = isSubscription
        ? { model: "api::plan.plan", id: planId }
        : { model: "api::top-up.top-up", id: topupId };

      // @ts-ignore
      const data = await strapi.query(dataSource.model).findOne({
        where: { id: dataSource.id },
      });

      clg("Data:", data);

      if (!data) {
        return ctx.badRequest(`${isSubscription ? "Plan" : "Topup"} not found`);
      }

      const price = isSubscription ? data.price : data.INR;

      const transaction_payload = {
        label: isSubscription ? "Subscription" : "Credit Purchase",
        type,
        amount: price,
        currency: "INR",
        status: "created",
        user_id: userId,
        publishedAt: new Date(),
        plan_id: isSubscription ? planId : undefined,
        topup_id: isSubscription ? undefined : topupId,
      };

      const transaction = await strapi
        .query("api::transaction.transaction")
        .create({ data: transaction_payload });

      clg("Transaction:", transaction);

      const rz_order = await rz.orders.create({
        currency: "INR",
        amount: price * 100, // Ensured Razorpay paise format
        notes: transaction,
        receipt: `receipt_fsa_${transaction.id}`,
      });

      const updatedTransaction = await strapi
        .query("api::transaction.transaction")
        .update({
          where: { id: transaction.id },
          data: {
            razorpay_order_id: rz_order.id,
          },
        });

      clg("Updated Transaction:", updatedTransaction);
      // TRX.commit();
      return ctx.send(rz_order);
    } catch (error) {
      // TRX.rollback();
      console.error("Error creating Razorpay order:", error);
      return ctx.badRequest("Error creating Razorpay order");
    }
  },
  /**
   * Create Razorpay Order
   * @param {Context} ctx - Koa context
   * @returns {Promise<any>}
   */
  async handleWebhook(ctx) {
    // const TRX = await strapi.db.connection.transaction();
    try {
      const {
        payload: {
          payment: {
            entity: { id, notes },
          },
        },
        // @ts-ignore
      } = ctx.request.body.data;

      const isSubscription = notes.type === "subscription";

      await strapi.query("api::transaction.transaction").update({
        where: { id: notes.id },
        data: {
          status: "captured",
          razorpay_payment_id: id,
        },
      });

      // we need to it service
      if (isSubscription) {
        await strapi.service("api::membership.membership").createAfterPayment({
          plan: notes.plan_id,
          user: notes.user_id,
          transaction: notes.id,
          start_date: new Date(),
          publishedAt: new Date(),
          end_date: getNextYearTodayDate(), // need to change
        });
      } else {
        const topup = await strapi
          .query("api::top-up.top-up")
          .findOne({ where: { id: notes.topup_id } });

        await strapi
          .service("api::credit-account.credit-account")
          .updateAccount(notes.user_id, "add", topup?.credits);
      }

      // TRX.commit();

      return ctx.send({ ok: true }, 200);
    } catch (error) {
      // TRX.rollback();
      console.error("Error handling webhook:", error);
      return ctx.badRequest("Error handling webhook");
    }
  },
  /**
   * Create Razorpay Order
   * @param {Context} ctx - Koa context
   * @returns {Promise<any>}
   */
  getCredits: async (ctx) => {
    const { userId } = ctx.request.query;
    try {
      if (!userId) {
        return ctx.badRequest("Missing parameters");
      }
      const credits = await strapi
        .service("api::credit-account.credit-account")
        .fetchBalance(userId);
      return ctx.send(credits);
    } catch (error) {
      console.error("Error getting credits:", error);
      return ctx.badRequest("Error getting credits");
    }
  },
});

module.exports = controller;
