"use strict";

/**
 * achivement controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
module.exports = createCoreController("api::achivement.achivement", {
  async create(ctx) {
    const data = ctx.request.body;
    console.log(data);
    const response = await super.create(ctx);
    await updateUserData(data.data);
    return response;
    // Fetch the existing watched entry
  },

  async leaderboard(ctx) {
    try {
      const achievements = await strapi.db
        .query("api::achivement.achivement")
        .findMany({
          select: ["coins"],
          populate: {
            user: {
              select: ["id", "firstname", "lastname", "avatar"],
            },
          },
        });

      // Calculate total coins for each user
      const userCoinsMap = new Map();
      achievements.forEach((achievement) => {
        const userId = achievement.user.id;
        const coins = parseInt(achievement.coins);

        if (!userCoinsMap.has(userId)) {
          userCoinsMap.set(userId, {
            id: userId,
            firstname: achievement.user.firstname,
            lastname: achievement.user.lastname,
            avatar: achievement.user.avatar,
            totalCoins: 0,
          });
        }

        userCoinsMap.get(userId).totalCoins += coins;
      });

      // Convert the Map to an array and sort it by totalCoins
      const sortedLeaderboard = Array.from(userCoinsMap.values()).sort(
        (a, b) => b.totalCoins - a.totalCoins
      );

      return ctx.send(sortedLeaderboard, 200);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return ctx.badRequest("Error fetching leaderboard");
    }
  },
});
// Placeholder user service functions
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
    const currentCoins = parseInt(user.coins || 0);
    const updatedCoins = currentCoins + parseInt(achievementData.coins);

    // Save the updated user data back to the database
    await userService.updateUser(userId, { coins: updatedCoins });
  } else {
    console.error("User not found");
    throw new Error("User not found");
  }
}
