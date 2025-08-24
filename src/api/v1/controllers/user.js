/**
 * @typedef {import('@strapi/strapi').Strapi} Strapi
 * @typedef {import('koa').Context} Context
 */

/**
 * @param {{ strapi: Strapi }} param0 - Strapi instance.
 * @returns {Object} Controller methods.
 */

const controller = ({ strapi }) => ({
  async uploadProfilePicture(ctx) {
    try {
      const { userId } = ctx.request.body.data;
      const { image } = ctx.request.files || {};

      if (!userId || !image) {
        return ctx.throw(400, "UserId and image are required");
      }

      const profilePicture = await strapi
        .service("api::profile-picture.profile-picture")
        .uploadProfilePicture(userId, image);

      ctx.status = 200;
      ctx.body = {
        success: true,
        data: profilePicture,
      };
    } catch (error) {
      console.error("Upload error:", error);
      ctx.throw(500, "Failed to upload profile picture");
    }
  },

  /* addons 
   type: "credits" | "basic" | "premium"
   amount: number
   */

  async addAddons(ctx) {
    try {
      const { userId, addons } = ctx.request.body.data;

      if (
        !userId ||
        !addons ||
        !addons.type ||
        !addons.amount ||
        !addons.credits
      ) {
        return ctx.throw(400, "UserId and addons are required");
      }

      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            id: userId,
          },
        });

      if (!user) {
        return ctx.throw(404, "User not found");
      }

      console.log("user", user);

      // Generate random purchase ID
      const purchaseId = Math.random().toString(36).substr(2, 9);

      // Create real-purchase entry for all cases
      let purchaseData = {
        user_id: userId.toString(),
        purchase_id: purchaseId,
        amount: addons.amount,
        status: "paid",
        publishedAt: new Date(),
      };

      let userUpdateData = {};

      if (addons.type === "credits") {
        // For credits: update credits field
        purchaseData.label = "credit";
        purchaseData.type = "credits";

        userUpdateData = {
          credits: parseInt(user.credits || 0) + parseInt(addons.credits || 0),
        };
      } else if (addons.type === "basic") {
        // For basic: update type to basic and handle premium field
        purchaseData.label = "protostar";
        purchaseData.type = "premium";

        const currentDate = Math.floor(Date.now() / 1000);
        const oneYearInSeconds = 365 * 24 * 60 * 60;

        let newPremiumDate;
        // If no premium field, create today + 1 year
        newPremiumDate = currentDate + oneYearInSeconds;

        userUpdateData = {
          credits: parseInt(user.credits || 0) + parseInt(addons.credits || 0),
          type: "basic",
          premium: newPremiumDate,
        };
      } else if (addons.type === "premium") {
        // For premium: update type to premium and handle premium field
        purchaseData.label = "supernova";
        purchaseData.type = "premium";

        const currentDate = Math.floor(Date.now() / 1000);
        const oneYearInSeconds = 365 * 24 * 60 * 60;

        let newPremiumDate;
        // If no premium field, create today + 1 year
        newPremiumDate = currentDate + oneYearInSeconds;

        userUpdateData = {
          credits: parseInt(user.credits || 0) + parseInt(addons.credits || 0),
          type: "premium",
          premium: newPremiumDate,
        };
      } else {
        return ctx.throw(
          400,
          "Invalid addon type. Must be 'credits', 'basic', or 'premium'"
        );
      }

      // Create real-purchase entry
      const newPurchase = await strapi
        .query("api::real-purchase.real-purchase")
        .create({
          data: purchaseData,
        });

      // Update user
      const updatedUser = await strapi.entityService.update(
        "plugin::users-permissions.user",
        userId,
        {
          data: userUpdateData,
        }
      );

      ctx.status = 200;
      ctx.body = {
        success: true,
        data: {
          user: updatedUser,
          purchase: newPurchase,
        },
      };
    } catch (error) {
      console.error("AddAddons error:", error);
      ctx.throw(500, "Failed to process addons");
    }
  },
});

module.exports = controller;
