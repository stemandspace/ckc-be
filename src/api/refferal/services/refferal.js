"use strict";

/**
 * refferal service
 */

const { createCoreService } = require("@strapi/strapi").factories;
const plan_based_reward = require("../../../lib/refferal");

module.exports = createCoreService("api::refferal.refferal", () => {
  return {
    async rewardCoins(referee, coins) {
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        referee
      );
      if (!user) {
        throw new Error("User not found");
      }
      await strapi.entityService.update(
        "plugin::users-permissions.user",
        user.id,
        {
          data: {
            coins: parseInt(user.coins) + parseInt(coins),
          },
        }
      );
    },

    async getRefferals(refferal, referee) {
      if (!refferal || !referee) {
        throw new Error("Refferal and referee are required");
      }
      const referrals = await strapi.entityService.findMany(
        "api::refferal.refferal",
        {
          filters: {
            $and: [
              {
                refferal: refferal,
              },
              {
                referee: referee,
              },
            ],
          },
        }
      );
      return referrals;
    },
    async getRefferalsByReferee(referee) {
      if (!referee) {
        throw new Error("Refferal and referee are required");
      }
      const referrals = await strapi.entityService.findMany(
        "api::refferal.refferal",
        {
          filters: {
            referee: referee,
          },
          populate: {
            refferal: {
              fields: ["id"],
            },
          },
        }
      );
      return referrals;
    },

    async createRefferal(refferal, referee) {
      if (!refferal || !referee) {
        throw new Error("Refferal and referee are required");
      }

      const referrals = await this.getRefferals(refferal, referee);

      if (referrals.length > 0) {
        throw new Error("Refferal already exists");
      }

      const newReferral = await strapi.entityService.create(
        "api::refferal.refferal",
        {
          data: {
            refferal: refferal,
            referee: referee,
            publishedAt: new Date(),
          },
        }
      );
      return newReferral;
    },

    async validateRefferal(referee, selected_plan) {
      if (!referee) {
        throw new Error("Refferal and referee are required");
      }

      const referrals = await this.getRefferalsByReferee(referee);

      if (referrals.length === 0) {
        throw new Error("Refferal not found");
      }

      const [referral] = referrals;

      const new_refferal_track = await strapi
        .service("api::refferal-track.refferal-track")
        .validateAndCreateRefferalTrack(referral.id, referee, selected_plan);

      await this.rewardCoins(
        referral?.refferal?.id,
        plan_based_reward[selected_plan]
      );

      return new_refferal_track;
    },
  };
});
