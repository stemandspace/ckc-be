"use strict";

/**
 * referral-config service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::referral-config.referral-config",
  ({ strapi }) => {
    return {
      async getReferralConfig() {
        return await strapi.entityService.findMany(
          "api::referral-config.referral-config",
          {
            populate: {
              milestones: {
                populate: {
                  rewards: {
                    fields: ["id"],
                  },
                },
              },
            },
          }
        );
      },
      async findMilestoneByNumber(currentMileStone = 0) {
        const config = await this.getReferralConfig();

        if (!config?.milestones || !Array.isArray(config.milestones)) {
          console.warn("Milestones not found in config");
          return null;
        }

        const milestone = config.milestones.find(
          (m) => Number(m.milestone) === Number(currentMileStone)
        );

        console.log(JSON.stringify({ currentMileStone, milestone }));

        return milestone || null;
      },
    };
  }
);
