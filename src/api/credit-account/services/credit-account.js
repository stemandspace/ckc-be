"use strict";

/**
 * credit-account service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::credit-account.credit-account",
  () => ({
    updateAccount: async (userId, type, value = 0) => {
      const isAdd = type === "add";

      const account = await strapi
        .query("api::credit-account.credit-account")
        .findOne({
          where: { user: userId },
        });

      if (!account) {
        if (!isAdd) {
          // Prevent subtraction if no account exists
          throw new Error("Insufficient credits to subtract.");
        }

        // Create new account if adding
        await strapi.query("api::credit-account.credit-account").create({
          data: {
            user: userId,
            credits: value,
            publishedAt: new Date(),
          },
        });
      } else {
        // Subtract or Add Credits
        const newCreditValue = isAdd
          ? account.credits + value
          : Math.max(0, account.credits - value); // Prevent negative credits

        if (!isAdd && account.credits < value) {
          throw new Error("Insufficient credits to subtract.");
        }

        await strapi.query("api::credit-account.credit-account").update({
          where: { id: account.id },
          data: { credits: newCreditValue },
        });
      }
    },

    // just fetch the balance if account is not available then return 0
    fetchCreditBalance: async (userId) => {
      const account = await strapi
        .query("api::credit-account.credit-account")
        .findOne({ where: { user: userId }, select: ["credits"] });
      return account?.credits || 0;
    },
  })
);
