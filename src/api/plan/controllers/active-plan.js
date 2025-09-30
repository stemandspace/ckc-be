"use strict";

/**
 * Optimized active-plan controller for ultra-fast user type and premium lookup
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::plan.plan", ({ strapi }) => ({
  /**
   * Ultra-fast user type and premium status lookup
   * @param {Object} ctx - Koa context
   * @returns {Promise<Object>} User type and premium status
   */
  async getActivePlan(ctx) {
    const { user_id } = ctx.request.query;

    // Fast validation
    if (!user_id) {
      return ctx.badRequest("user_id required");
    }

    try {
      // Optimized query - direct database access for maximum speed
      const user = await strapi.db.connection
        .select("type", "premium")
        .from("up_users")
        .where("id", user_id)
        .first();

      if (!user) {
        return ctx.notFound("User not found");
      }

      // Minimal response - no extra fields
      return ctx.send({
        type: user.type,
        premium: user.premium,
      });
    } catch (error) {
      console.error("Error:", error);
      return ctx.internalServerError("Error");
    }
  },
}));
