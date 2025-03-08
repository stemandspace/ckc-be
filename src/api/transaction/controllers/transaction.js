"use strict";

const rz = require("../../../rz");
const clg = require("../../../lib/clg");

/**
 * transaction controller
 */

/**
 * @typedef {import('@strapi/strapi').Strapi} Strapi
 * @typedef {import('koa').Context} Context
 */

/**
 * NAC custom APIs
 * @param {{ strapi: Strapi }} param0 - Strapi instance.
 * @returns {Object} Controller methods.
 */

const { createCoreController } = require("@strapi/strapi").factories;

// type = "subscription" | "credits"

module.exports = createCoreController("api::transaction.transaction", {
  /**
   * Create Razorpay Order
   * @param {Context} ctx - Koa context
   * @returns {Promise<any>}
   */
  async createRzOrder(ctx) {
    const TRX = await strapi.db.connection.transaction();
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
      TRX.commit();
      return ctx.send(rz_order);
    } catch (error) {
      TRX.rollback();
      console.error("Error creating Razorpay order:", error);
      return ctx.badRequest("Error creating Razorpay order");
    }
  },
});
