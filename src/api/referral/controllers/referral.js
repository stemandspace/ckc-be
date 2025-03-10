"use strict";

/**
 * referral controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::referral.referral", {
  async create(ctx) {
    //@ts-ignore
    const data = ctx.request.body;
    console.log(data);
    const response = await super.create(ctx);
    // await updateUserData(data.data);
    return response;
    // Fetch the existing watched entry
  },
});

const userService = {
  getUserById: async (userId) => {
    try {
      // Fetch the user from the database using Strapi query
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: userId },
          select: ["coins", "id"],
        });

      if (!user) {
        console.error("User not found");
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },
  updateUser: async (userId, userData) => {
    try {
      // Update the user in the database using Strapi query
      await strapi.query("plugin::users-permissions.user").update({
        where: { id: userId },
        data: userData,
      });

      // You can optionally return the updated user data or a success flag
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
};

async function updateUserData(achievementData) {
  // Get user ID from achievement data
  const userId = achievementData.user;

  // Fetch the user from the database (you may need to customize this based on your user model)
  const user = await userService.getUserById(userId);

  // Update user's coins based on the achievement data
  if (user) {
    const currentCoins = parseInt(user.coins);
    const updatedCoins = currentCoins + parseInt(achievementData.coins);

    // Save the updated user data back to the database
    await userService.updateUser(userId, { coins: updatedCoins });
  } else {
    console.error("User not found");
    throw new Error("User not found");
  }
}
