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
      return await strapi.entityService.findMany(
        "api::refferal-track.refferal-track",
        {
          populate: {
            refferal: {
              filters: {
                referee: referee,
              },
            },
          },
        }
      );
    },

    async validateAndCreateRefferalTrack(refferal, referee, plan) {
      const refferal_tracks = await this.findRefferalTrackByReferee(referee);

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
  })
);
