"use strict";

/**
 * @typedef {import('@strapi/strapi').Strapi} Strapi
 * @typedef {import('koa').Context} Context
 */

/**
 * @param {{ strapi: Strapi }} param0 - Strapi instance.
 * @returns {Object} Controller methods.
 */

const controller = ({ strapi }) => ({
  /**
   * Ultra-fast user data lookup by user_id
   * Returns: pp (profile_picture), coins, email, country, username, firstname, lastname, type, premium, status
   * @param {Object} ctx - Koa context
   * @returns {Promise<Object>} User data
   */
  async getUserData(ctx) {
    const { user_id } = ctx.request.query;

    // Fast validation
    if (!user_id) {
      return ctx.badRequest("user_id required");
    }

    try {
      const t0 = Date.now();
      // Optimized queries - run in parallel for maximum speed
      const [user, profilePicture] = await Promise.all([
        // Get user data (including type and premium from active-plan logic)
        strapi.db.connection
          .select(
            "id",
            "username",
            "email",
            "firstname",
            "lastname",
            "coins",
            "country",
            "type",
            "premium",
            "blocked"
          )
          .from("up_users")
          .where("id", user_id)
          .first(),
        // Get profile picture using Strapi entityService with minimal fields
        strapi.entityService.findMany("api::profile-picture.profile-picture", {
          filters: {
            user: { id: Number(user_id) },
            publishedAt: { $notNull: true },
          },
          populate: {
            image: {
              fields: ["url", "formats"],
            },
          },
          fields: [],
          sort: { id: "desc" },
          limit: 1,
        }),
      ]);

      if (!user) {
        return ctx.notFound("User not found");
      }

      // Derive image URL
      let profilePictureUrl = null;
      const ppRecord = Array.isArray(profilePicture)
        ? profilePicture[0]
        : profilePicture;
      /** @type {any} */
      const ppAny = ppRecord;
      if (ppAny && ppAny.image) {
        const formats = ppAny.image?.formats || null;
        profilePictureUrl =
          (formats && formats.small && formats.small.url) ||
          ppAny.image?.url ||
          null;
      }

      // Determine status based on blocked field
      const status = user.blocked ? "blocked" : "active";

      // Light caching to reduce repeated calls
      ctx.set("Cache-Control", "private, max-age=60");
      ctx.set("X-Session-GenMs", String(Date.now() - t0));

      // Minimal response with only requested fields (includes type and premium from active-plan logic)
      return ctx.send({
        pp: profilePictureUrl,
        coins: user.coins || 0,
        email: user.email,
        country: user.country || "India",
        username: user.username,
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        type: user.type || "free",
        premium: user.premium,
        status: status,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      return ctx.internalServerError("Error fetching user data");
    }
  },
});

module.exports = controller;
