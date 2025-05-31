"use strict";

/**
 * refferal service
 */

const { createCoreService } = require("@strapi/strapi").factories;
const plan_based_reward = require("../../../lib/refferal");

module.exports = createCoreService("api::refferal.refferal", () => {
  return {
    // fetch completed refferal data
    async getRefferedUserList(uid, page = 1, pageSize = 10) {
      if (!uid) {
        throw new Error("User ID is required");
      }
      const refferals = await strapi.entityService.findMany(
        "api::refferal.refferal",
        {
          filters: {
            refferal: uid,
          },
          populate: {
            refferal_tracks: {
              fields: ["coins", "type", "plan", "milestone"],
            },
            referee: {
              fields: ["firstname", "lastname", "username"],
            },
          },
          pagination: {
            page: page,
            pageSize: pageSize,
          },
          sort: ["createdAt:desc"],
        }
      );
      return refferals;
    },

    async getNextRewardInfo(uid) {
      if (!uid) {
        throw new Error("User ID is required");
      }

      const referral_config = await strapi
        .service("api::referral-config.referral-config")
        .getReferralConfig();

      const refferal_tracks = await strapi
        .service("api::refferal-track.refferal-track")
        .filterPaidRefferalTrackForRefferal(uid);

      const total_tracks = refferal_tracks.length;

      const next_reward = referral_config?.milestones?.find(
        (item) => item.milestone > total_tracks
      );

      return {
        total_tracks,
        referral_config,
        next_reward,
      };
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

      // Create achivement
      await strapi.entityService.create("api::achivement.achivement", {
        data: {
          transectionType: "dr",
          contentType: "referral",
          publishedAt: new Date(),
          label: "refferal reward",
          user: referral?.refferal?.id,
          transectionAmount: plan_based_reward[selected_plan].toString(),
        },
      });

      // Processing Reward
      await strapi.service("api::reward.reward").updateCoins({
        userId: referral?.refferal?.id,
        coins: plan_based_reward[selected_plan],
      });

      const refferal_tracks = await strapi
        .service("api::refferal-track.refferal-track")
        .filterPaidRefferalTrackForRefferal(referral?.refferal?.id);

      const total_tracks = refferal_tracks.length;

      const referral_config = await strapi
        .service("api::referral-config.referral-config")
        .findMilestoneByNumber(total_tracks);

      if (
        referral_config?.rewards &&
        Array.isArray(referral_config?.rewards) &&
        referral_config.length !== 0
      ) {
        await strapi.service("api::reward.reward").reward({
          userId: referral?.refferal?.id,
          rewardIds: referral_config?.rewards?.map((reward) => reward?.id),
          label: "refferal milestone reward",
        });
      }

      return new_refferal_track;
    },
  };
});
