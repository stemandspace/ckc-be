"use strict";

/**
 * referral service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::referral.referral", () => ({
  async getReferralCountForMonth(userId) {

    if (!userId) {
      throw new Error("User ID is required");
    }
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );
    // Count referrals in the current month
    const referralsThisMonth = await strapi.db
      .query("api::achivement.achivement")
      .count({
        where: {
          user: Number(userId),
          contentType: "referral",
          createdAt: {
            $gte: startOfMonth.toISOString(),
            $lte: endOfMonth.toISOString(),
          },
        },
      });
    return referralsThisMonth;
    
  },
}));
