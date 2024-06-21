"use strict";

/**
 * achivement controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::achivement.achivement", {
  async create(ctx) {
    const response = await super.create(ctx);
    return response;
  },

  // here i want to filter by created at with type of week | month | all
  async leaderboard(ctx) {
    const type = ctx.URL.searchParams.get("type") ?? "a"; // w | m | a
    var weekDates = getStartAndEndDateOfWeek();
    var monthDates = getStartAndEndDateOfMonth();
    const whereQuery =
      type == "a"
        ? undefined
        : {
            created_at:
              type == "w"
                ? {
                    $gte: weekDates.startDate,
                    $lt: weekDates.endDate,
                  }
                : {
                    $gte: monthDates.startDate,
                    $lt: monthDates.endDate,
                  },
          };
    try {
      const achievements = await strapi.db
        .query("api::achivement.achivement")
        .findMany({
          where: whereQuery,
          populate: {
            user: {
              select: ["id", "firstname", "lastname", "avatar", "username"],
            },
          },
        });

      // Calculate total coins for each user
      const userCoinsMap = new Map();

      achievements.forEach((achievement) => {
        if (achievement?.user == null) {
          return;
        } else {
          const userId = achievement?.user?.id;
          const coins = parseInt(achievement?.transectionAmount);

          if (!userCoinsMap.has(userId)) {
            userCoinsMap.set(userId, {
              id: userId,
              totalCoins: 0,
              avatar: achievement?.user?.avatar,
              lastname: achievement?.user?.lastname,
              username: achievement?.user?.username,
              firstname: achievement?.user?.firstname,
              badges: [],
              certificates: [],
            });
          }

          if (achievement.contentType === "badge") {
            userCoinsMap.get(userId)?.badges.push(achievement?.contentId);
          }

          if (achievement.contentType === "certificate") {
            userCoinsMap.get(userId)?.certificates.push(achievement?.contentId);
          }

          if (achievement.transectionType == "dr") {
            userCoinsMap.get(userId).totalCoins += coins;
          }
        }
      });

      // Convert the Map to an array and sort it by totalCoins
      const sortedLeaderboard = Array.from(userCoinsMap.values()).sort(
        (a, b) => b?.totalCoins - a?.totalCoins
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

//  Utils
function getStartAndEndDateOfWeek() {
  // Get today's date
  var today = new Date();

  // Calculate the start date of the week (Sunday)
  var startDate = new Date(today.setDate(today.getDate() - today.getDay() + 1));

  // Calculate the end date of the week (Saturday)
  var endDate = new Date(today.setDate(today.getDate() - today.getDay() + 7));

  // Return start and end dates
  return { startDate, endDate };
}

function getStartAndEndDateOfMonth() {
  // Get today's date
  var today = new Date();

  // Calculate the start date of the month
  var startDate = new Date(today.getFullYear(), today.getMonth(), 1);

  // Calculate the end date of the month
  var endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Return start and end dates
  return { startDate, endDate };
}
