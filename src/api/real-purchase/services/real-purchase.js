"use strict";

/**
 * real-purchase service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::real-purchase.real-purchase",
  ({ strapi }) => ({
    /**
     * Check if user's premium subscription is still valid
     * @param {string} userId - User ID to check
     * @returns {Promise<boolean>} True if premium is valid, false otherwise
     */
    async isPremiumValid(userId) {
      try {
        const user = await strapi
          .query("plugin::users-permissions.user")
          .findOne({
            where: { id: userId },
            select: ["premium", "type"],
          });

        if (!user || !user.premium) {
          return false;
        }

        const premiumExpirationMs = parseInt(user.premium);
        const currentTimeMs = Date.now();

        return currentTimeMs < premiumExpirationMs;
      } catch (error) {
        console.error("Error checking premium validity:", error);
        return false;
      }
    },

    /**
     * Add credits to user account
     * @param {string} userId - User ID
     * @param {number} creditsToAdd - Number of credits to add
     * @returns {Promise<{success: boolean, previousCredits?: number, newCredits?: number, error?: string}>}
     */
    async addCreditsToUser(userId, creditsToAdd) {
      try {
        const user = await strapi
          .query("plugin::users-permissions.user")
          .findOne({
            where: { id: userId },
            select: ["credits"],
          });

        if (!user) {
          throw new Error("User not found");
        }

        const currentCredits = parseInt(user.credits) || 0;
        const newCredits = currentCredits + creditsToAdd;

        await strapi.query("plugin::users-permissions.user").update({
          where: { id: userId },
          data: { credits: newCredits.toString() },
        });

        return {
          success: true,
          previousCredits: currentCredits,
          newCredits: newCredits,
        };
      } catch (error) {
        console.error("Error adding credits to user:", error);
        return {
          success: false,
          error: error.message,
        };
      }
    },

    /**
     * Update user premium status
     * @param {string} userId - User ID
     * @param {number} durationMs - Premium duration in milliseconds
     * @returns {Promise<boolean>} Success status
     */
    async updateUserPremium(userId, durationMs) {
      try {
        const premiumExpirationMs = Date.now() + durationMs;

        await strapi.query("plugin::users-permissions.user").update({
          where: { id: userId },
          data: {
            premium: premiumExpirationMs.toString(),
            type: "premium",
          },
        });

        return true;
      } catch (error) {
        console.error("Error updating user premium:", error);
        return false;
      }
    },

    /**
     * Get credits from plan
     * @param {string} planId - Plan ID
     * @returns {Promise<number>} Credits amount
     */
    async getPlanCredits(planId) {
      try {
        const plan = await strapi.query("api::plan.plan").findOne({
          where: { id: planId },
          select: ["credits", "metadata"],
        });

        if (!plan) {
          console.log("Plan not found:", planId);
          return 0;
        }

        // First try to get credits from metadata
        if (plan.metadata && plan.metadata.credits) {
          const metadataCredits = parseInt(plan.metadata.credits);
          console.log("Plan credits from metadata:", {
            planId,
            metadataCredits,
            metadata: plan.metadata,
          });
          return metadataCredits;
        }

        // Fallback to direct credits field
        const directCredits = plan.credits ? parseInt(plan.credits) : 0;
        console.log("Plan credits from direct field:", {
          planId,
          directCredits,
          metadata: plan.metadata,
        });
        return directCredits;
      } catch (error) {
        console.error("Error getting plan credits:", error);
        return 0;
      }
    },

    /**
     * Get credits from topup
     * @param {string} topupId - Topup ID
     * @returns {Promise<number>} Credits amount
     */
    async getTopupCredits(topupId) {
      try {
        const topup = await strapi.query("api::top-up.top-up").findOne({
          where: { id: topupId },
          select: ["credits"],
        });

        return topup && topup.credits ? parseInt(topup.credits) : 0;
      } catch (error) {
        console.error("Error getting topup credits:", error);
        return 0;
      }
    },
  })
);
