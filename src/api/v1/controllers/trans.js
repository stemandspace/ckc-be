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
      let promocode_res = null;
      const { type, planId, topupId, userId, promocode } =
        // @ts-ignore
        ctx.request.body.data;

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

      promocode_res = await strapi
        .service("api::promocode.promocode")
        .applicable(promocode, userId, price);

      const promocode_applicable = promocode_res?.applicable;

      clg("Promocode:", promocode_res);

      if (promocode && !promocode_applicable) {
        return ctx.badRequest(promocode_res.reason);
      }

      const transaction_payload = {
        label: isSubscription ? "Subscription" : "Credit Purchase",
        type,
        amount: price,
        discount: promocode_applicable,
        discounted_price: promocode_applicable
          ? promocode_res?.discounted_price
          : 0,
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

      if (promocode && promocode_applicable) {
        await strapi
          .service("api::promocode.promocode")
          .attach(userId, promocode_res?.data?.id, transaction?.id);
      }

      const managed_price =
        promocode_applicable && transaction?.discount
          ? transaction?.discounted_price
          : price; // Ensured Razorpay paise format

      // remove unwanted fields
      delete transaction.createdAt;
      delete transaction.updatedAt;
      delete transaction.publishedAt;

      const rz_order = await rz.orders.create({
        amount: managed_price * 100,
        currency: "INR",
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
            entity: { id, description, notes },
          },
        },
        // @ts-ignore
      } = ctx.request.body.data;

      // validation for payment origin;
      if (description !== "STUDENT_APP_PAYMENT") {
        console.log("PAYMENT ORIGIN IS NOT VERIFIED");
        return ctx.send({ ok: true }, 200);
      }

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
          .addMembershipCredits(notes.user_id, topup?.credits);
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
      const account = await strapi
        .query("api::credit-account.credit-account")
        .findOne({ where: { user: userId }, select: ["credits"] });

      return ctx.send(account?.credits || 0);
    } catch (error) {
      console.error("Error getting credits:", error);
      return ctx.badRequest("Error getting credits");
    }
  },
  /**
   * Create Razorpay Order
   * @param {Context} ctx - Koa context
   * @returns {Promise<any>}
   */
  getCoins: async (ctx) => {
    const { userId } = ctx.request.query;
    try {
      if (!userId) {
        return ctx.badRequest("Missing parameters");
      }
      const account = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: { user: userId }, select: ["coins"] });
      return ctx.send(account?.coins || 0);
    } catch (error) {
      console.error("Error getting credits:", error);
      return ctx.badRequest("Error getting credits");
    }
  },
  /**
   * Create Razorpay Order
   * @param {Context} ctx - Koa context
   * @returns {Promise<any>}
   */
  getActiveMembership: async (ctx) => {
    const { userId } = ctx.request.query;
    try {
      if (!userId) {
        return ctx.badRequest("Missing parameters");
      }
      const membership = await strapi
        .service("api::membership.membership")
        .getActiveMembership(userId);
      return ctx.send(membership);
    } catch (error) {
      console.error("Error getting membership status:", error);
      return ctx.badRequest("Error getting membership status");
    }
  },
});

module.exports = controller;
