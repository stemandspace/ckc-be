"use strict";

/**
 * refferal-track service
 */

const { createCoreService } = require("@strapi/strapi").factories;
const plan_based_reward = require("../../../lib/refferal");

module.exports = createCoreService(
  "api::refferal-track.refferal-track",
  ({ strapi }) => ({
    async createRefferalTrack(data) {
      return strapi.entityService.create("api::refferal-track.refferal-track", {
        data: {
          ...data,
        },
      });
    },

    async findRefferalTrackByReferee(referee) {
      const refferals = await strapi
        .service("api::refferal.refferal")
        .getRefferalsByReferee(referee);

      const refferal_track = await strapi.entityService.findMany(
        "api::refferal-track.refferal-track",
        {
          filters: {
            refferal: refferals[0].id,
          },
        }
      );
      return refferal_track;
    },

    async validateAndCreateRefferalTrack(refferal, referee, plan) {
      const refferal_tracks = await this.findRefferalTrackByReferee(referee);

      console.log("refferal_tracks", refferal_tracks);
      console.log("referee", referee);

      const list_of_plans = refferal_tracks.map((track) => track.plan);

      if (list_of_plans.includes(plan)) {
        throw new Error("Refferal tracks already has this plan");
      }

      const new_refferal_track = await this.createRefferalTrack({
        refferal: refferal,
        plan: plan,
        type: "subscription",
        publishedAt: new Date(),
        coins: plan_based_reward[plan],
      });

      return new_refferal_track;
    },

    async filterPaidRefferalTrackForRefferal(refferal) {
      console.log("refferal-user", refferal);
      const paid_refferal_tracks = await strapi.entityService.findMany(
        "api::refferal-track.refferal-track",
        {
          filters: {
            type: "subscription",
            $or: [
              {
                plan: {
                  $eq: "basic",
                },
              },
              {
                plan: {
                  $eq: "premium",
                },
              },
            ],
          },
          populate: {
            refferal: {
              populate: {
                refferal: {
                  filters: {
                    id: refferal,
                  },
                },
              },
            },
          },
        }
      );
      return paid_refferal_tracks;
    },
  })
);
