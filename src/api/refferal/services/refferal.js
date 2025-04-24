"use strict";

/**
 * refferal service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::refferal.refferal", () => {
  return {
    async getMilestoneReward() {
      // I need to fetch data from single type
      //   const milestone_rewards = await strapi.entityService.findMany(
      //     "api::referral-config.referral-config"
      //   );
      //   return milestone_rewards;
      console.log("milestone_rewards");
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

    async validateRefferal(refferal, referee, selected_plan) {
      const plan_based_reward = {
        free: 5,
        basic: 10,
        premium: 20,
      };

      if (!refferal || !referee) {
        throw new Error("Refferal and referee are required");
      }

      const referrals = await this.getRefferals(refferal, referee);

      if (referrals.length === 0) {
        throw new Error("Refferal not found");
      }

      const [referral] = referrals;

      const refferal_tracks = await strapi
        .query("api::refferal-track.refferal-track")
        .findMany({
          filters: {
            id: referral.id,
          },
        });

      const subscription_tracks =
        refferal_tracks.filter((track) => track.type == "subscription") ?? [];

      const list_of_plans = subscription_tracks.map((track) => track.plan);

      if (list_of_plans.includes(selected_plan)) {
        throw new Error("Refferal tracks already has this plan");
      }

      const milestone_rewards = await this.getMilestoneReward();

      const new_refferal_track = await strapi.entityService.create(
        "api::refferal-track.refferal-track",
        {
          data: {
            refferal: referral.id,
            plan: selected_plan,
            type: "subscription",
            publishedAt: new Date(),
            coins: plan_based_reward[selected_plan],
          },
        }
      );

      return new_refferal_track;
    },
  };
});
