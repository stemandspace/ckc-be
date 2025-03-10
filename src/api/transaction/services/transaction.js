"use strict";

const razorpay = require("../../../rz/index");
/**
 * transaction service
 */

// const { createCoreService } = require("@strapi/strapi").factories;

// module.exports = createCoreService("api::transaction.transaction");

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
  //   async getTransaction(ctx) {},

  async initiateTransection(params) {
    const TRX = await strapi.db.connection.transaction();
    try {
      const {
        type,
        amount,
        currency,
        user_id,
        plan_id = null,
        topup_id = null,
        status = "created",
      } = params;

      if (!user_id || !amount || !currency || !type) {
        throw new Error("Invalid params");
      }

      const transaction = await strapi
        .query("api::transaction.transaction")
        .create({
          data: {
            type,
            amount,
            status,
            currency,
            user_id,
            plan_id,
            topup_id,
            publishedAt: new Date(),
          },
        });

      if (!transaction.id) {
        throw new Error("Transaction not found");
      }

      const order = await razorpay.orders.create({
        currency,
        notes: {
          type,
          user_id,
          plan_id,
          topup_id,
          transaction_id: transaction?.id,
        },
        amount: amount * 100,
        receipt: `receipt_${transaction?.id}`,
      });

      await TRX.commit();

      return {
        transaction,
        order,
      };
    } catch (error) {
      await TRX.rollback();
      console.log("transaction failed", error, params);
      return null;
    }
  },
});

module.exports = controller;
