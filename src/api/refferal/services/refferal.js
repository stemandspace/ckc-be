"use strict";

/**
 * refferal service
 */

const { createCoreService } = require("@strapi/strapi").factories;
const plan_based_reward = require("../../../lib/refferal");

module.exports = createCoreService("api::refferal.refferal", () => {
  return {
    async rewardCoins(userId, coins) {
      const payload = {
        user: userId,
        contentType: "coins",
        transectionAmount: coins.toString(),
        transectionType: "dr",
        label: "refferal reward",
        publishedAt: new Date(),
      };

      await strapi.db.query("api::achivement.achivement").create({
        data: { ...payload },
      });

      await strapi.service("api::reward.reward").updateCoins({
        userId: userId,
        coins,
      });
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
      const reward_coins = {
        free: 5,
        basic: 10,
        premium: 20,
      };

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

      console.log({
        userId: referral?.refferal?.id,
        coins: reward_coins[selected_plan],
      });

      this.rewardCoins({
        userId: referral?.refferal?.id,
        coins: reward_coins[selected_plan],
      });

      const refferal_tracks = await strapi
        .service("api::refferal-track.refferal-track")
        .filterPaidRefferalTrackForRefferal(referral?.refferal?.id);

      const total_tracks = refferal_tracks.length;

      const referral_config = await strapi
        .service("api::referral-config.referral-config")
        .findMilestoneByNumber(total_tracks);

      console.log("refferal_tracks", refferal_tracks);
      console.log("refferal_config", referral_config);

      if (
        referral_config?.rewards &&
        Array.isArray(referral_config?.rewards) &&
        referral_config.length !== 0
      ) {
        await strapi.service("api::reward.reward").reward({
          userId: referral?.refferal?.id,
          rewardIds: referral_config.rewards.map((reward) => reward.id),
          label: "refferal milestone reward",
        });
      }

      return new_refferal_track;
    },
  };
});
