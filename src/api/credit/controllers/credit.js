"use strict";

/**
 * A set of functions called "actions" for `credit`
 */

module.exports = {
  buyCredit: async (ctx) => {
    const { userId, coins, content_id, label, type } = ctx.request.body.data;
    try {
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: userId },
          populate: ["credits"],
        });

      if (!user) {
        return ctx.notFound("User not found");
      }

      const updatedCoins = parseInt(user.credits) + parseInt(coins);

      user.credits = updatedCoins;

      const updatedUser = await strapi
        .query("plugin::users-permissions.user")
        .update({
          where: { id: userId },
          data: { credits: updatedCoins },
        });
      const newPurchase = await strapi
        .query("api::real-purchase.real-purchase")
        .create({
          data: {
            user_id: userId,
            purchase_id: Math.random().toString(36).substr(2, 9),
            amount: coins,
            status: "paid",
            user: userId,
            label,
            publishedAt: new Date(),
            type,
          },
        });
      return ctx.send(updatedCoins, 200);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  getCredits: async (ctx) => {
    try {
      const { id } = ctx.query;
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: id },
          select: ["credits"],
        });

      if (!user) {
        return ctx.notFound("User not found");
      }
      return ctx.send(user, 200);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
};
