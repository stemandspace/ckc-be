"use strict";

const { SendZeptoMail } = require("../../../lib/send-mail");
/**
 * reward service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::reward.reward", () => ({
  // reward to user achievement;
  reward: async ({ userId, rewardIds = [], type, contentId = null,label }) => {
    try {
      const availableRewardId = await strapi.db
        .query("api::achivement.achivement")
        .findMany({
          where: {
            user: Number(userId),
            rewardId: {
              $in: rewardIds,
            },
          },
          select: ["rewardId"],
        });

      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: Number(userId) },
          select: ["firstname", "lastname", "email"],
        });

      const flatterRewardId = availableRewardId.map((a) => Number(a.rewardId));
      const unavailableRewardIds = rewardIds.filter((rewardId) => {
        return !flatterRewardId.includes(rewardId);
      });
      let totalCoins = 0;
      let cId = contentId;
      const promises = unavailableRewardIds.map(async (rewardId) => {
        const reward = await strapi.db.query("api::reward.reward").findOne({
          where: {
            id: rewardId,
          },
          populate: {
            marketplace_promocode: {
              populate: {
                shopify_price_rule: true,
              },
            },
            system_promocode: {
              select: ["id"],
            },
            badge: {
              select: ["id"],
            },
            avatar: {
              select: ["id"],
            },
            certificate: {
              select: ["id"],
            },
            bannar: {
              select: ["id"],
            },
          },
        });
        if (reward.type === "coins") {
          totalCoins += Number(reward.value);
          await strapi.service("api::reward.reward").updateCoins({
            userId,
            coins: totalCoins,
          });
        }
        if (reward.type === "marketplacePromocode") {
          const priceRuleId =
            reward?.marketplace_promocode?.shopify_price_rule?.id;
          if (priceRuleId) {
            const coupon = await strapi.db
              .query("api::shopify-coupon.shopify-coupon")
              .create({
                data: {
                  user: Number(userId),
                  shopify_price_rule: Number(priceRuleId),
                },
              });
            cId = coupon.id.toString();
          }
        }
        if (reward.type === "systemPromocode") {
          const systemPromocode = reward?.system_promocode;
          if (systemPromocode) {
            await strapi.db.query("api::promocode.promocode").update({
              where: { id: systemPromocode.id },
              data: {
                users: {
                  connect: [{ id: Number(userId) }],
                },
              },
            });
          }
          cId = systemPromocode.id.toString();
        }
        if (reward.type === "badge") {
          const badgeId = reward?.badge?.id;
          if (badgeId) {
            cId = badgeId.toString();
          }
        }
        if (reward.type === "avatar") {
          const avatarId = reward?.avatar?.id;
          if (avatarId) {
            cId = avatarId.toString();
          }
        }
        if (reward.type === "certificate") {
          const certificateId = reward?.certificate?.id;
          if (certificateId) {
            cId = certificateId.toString();
          }
        }
        if (reward.type === "bannar") {
          const bannarId = reward?.bannar?.id;
          if (bannarId) {
            cId = bannarId.toString();
          }
        }
        const payload = {
          user: Number(userId),
          rewardId: rewardId,
          contentType: type ? type : reward.type,
          transectionAmount: reward.value ? reward.value : "0",
          transectionType: "dr",
          label: label ? label : "Reward",
          publishedAt: new Date(),
          contentId: cId ? cId : null,
        };

        const achievement = await strapi.db
          .query("api::achivement.achivement")
          .create({
            data: { ...payload },
          });

        return { achievement, reward, user };
      });
      const res = await Promise.all(promises);
      return res;
    } catch (error) {
      console.error(error);
    }
  },

  updateCoins: async ({ userId, coins }) => {
    try {
      const us = await strapi.query("plugin::users-permissions.user").findOne({
        where: { id: Number(userId) },
        select: ["coins"],
      });
      const vl = coins ? Number(coins) : 0;
      const updatedCoins = parseInt(us.coins) + vl;
      await strapi.query("plugin::users-permissions.user").update({
        where: { id: Number(userId) },
        data: {
          coins: `${updatedCoins}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
}));
