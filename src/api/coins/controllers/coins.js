const { parse } = require("date-fns");

// api/controllers/UserAPI.js
module.exports = {
  updateCoinsAndUnlockVideo: async (ctx) => {
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
      if (user.credits <= 0) {
        return ctx.throw(400, "User does not have enough coins");
      }
      const updatedCoins = user.credits - coins;

      user.credits = updatedCoins;

      const updatedUser = await strapi
        .query("plugin::users-permissions.user")
        .update({
          where: { id: userId },
          data: { credits: updatedCoins },
        });
      const newPurchase = await strapi.query("api::purchase.purchase").create({
        data: {
          content_id: content_id,
          user_id: userId,
          purchase_id: Math.random().toString(36).substr(2, 9),
          purchase_date: new Date().toString(),
          amount: coins,
          status: "paid",
          user: userId,
          label,
          publishedAt: new Date(),
          type,
        },
      });
      return ctx.send(newPurchase, 200);
    } catch (error) {
      ctx.throw(500, error);
    }
  },
  getCoins: async (ctx) => {
    try {
      const { id } = ctx.query;
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: id },
          select: ["coins"],
        });

      if (!user) {
        return ctx.notFound("User not found");
      }
      return ctx.send(user, 200);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  VirtualPurchase: async (ctx) => {
    const {
      rewardId,
      label,
      userId,
      contentId,
      contentType,
      transectionType,
      transectionAmount,
    } = ctx.request.body.data;

    try {
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: userId },
          populate: ["coins"],
        });

      if (!user) {
        return ctx.notFound("User not found");
      }

      if (transectionType === "cr") {
        if (user.coins <= 0) {
          return ctx.throw(400, "user does not have enough coins");
        }
      }

      const updatedCoins =
        transectionType == "cr"
          ? parseInt(user.coins) - parseInt(transectionAmount)
          : parseInt(user.coins) + parseInt(transectionAmount);
      user.coins = updatedCoins;

      const updatedUserWithCoins = await strapi
        .query("plugin::users-permissions.user")
        .update({
          where: { id: userId },
          data: { coins: updatedCoins },
        });

      const newPurchase = await strapi
        .query("api::achivement.achivement")
        .create({
          data: {
            rewardId,
            label,
            contentId,
            contentType,
            user: userId,
            transectionType,
            transectionAmount,
            publishedAt: new Date(),
          },
        });
      return ctx.send(newPurchase, 200);
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  getVirtualPurchase: async (ctx) => {
    const types = ["avatar", "badge", "banner"];
    try {
      const { id } = ctx.query;
      const VirtualPurchases = await strapi
        .query("api::achivement.achivement")
        .findMany({
          select: ["reward_id"],
          where: {
            user: id,
            $or: types.map((type) => ({
              type: type,
            })),
          },
        });
      const rewardIds = VirtualPurchases.map((item) => item.reward_id);
      const assets = await strapi.query("api::product.product").findMany({
        where: {
          id: {
            $in: rewardIds,
          },
        },
        populate: ["images"],
      });
      ctx.body = assets;
    } catch (error) {
      ctx.throw(500, error);
    }
  },
};
