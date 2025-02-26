"use strict";

/**
 * achivement service
 */
const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::achivement.achivement", () => ({
  // type = weekly | monthly | overall
  calculateGlobalLeaderboard: async (type = "overall") => {
    try {
      var weekDates = getStartAndEndDateOfWeek();
      var monthDates = getStartAndEndDateOfMonth();

      const whereFilter = {
        overall: {
          transectionAmount: {
            $gt: 0,
          },
        },
        weekly: {
          transectionAmount: {
            $gt: 0,
          },
          created_at: {
            $gte: weekDates.startDate,
            $lt: weekDates.endDate,
          },
        },
        monthly: {
          transectionAmount: {
            $gt: 0,
          },
          created_at: {
            $gte: monthDates.startDate,
            $lt: monthDates.endDate,
          },
        },
      };

      const achievements = await strapi.db
        .query("api::achivement.achivement")
        .findMany({
          where: whereFilter[type],
          populate: {
            user: {
              select: ["id", "firstname", "lastname", "avatar", "username"],
            },
          },
          pageSize: 100000,
        });

      const dataMap = new Map();

      achievements.forEach((achievement) => {
        if (achievement?.user == null) {
          return;
        } else {
          const userId = achievement?.user?.id;
          const coins = parseInt(achievement?.transectionAmount);

          if (!dataMap.has(userId)) {
            dataMap.set(userId, {
              points: 0,
              id: userId,
              avatar: achievement?.user?.avatar,
              lastname: achievement?.user?.lastname,
              username: achievement?.user?.username,
              firstname: achievement?.user?.firstname,
            });
          }
          if (achievement.transectionType == "dr") {
            dataMap.get(userId).points += coins;
          }
        }
      });

      const sortedLeaderboard = Array.from(dataMap.values()).sort(
        (a, b) => b?.points - a?.points
      );

      return sortedLeaderboard;
    } catch (err) {}
  },
}));

//  Utils
function getStartAndEndDateOfWeek() {
  var today = new Date();
  var startDate = new Date(today.setDate(today.getDate() - today.getDay() + 1));
  var endDate = new Date(today.setDate(today.getDate() - today.getDay() + 7));
  return { startDate, endDate };
}

function getStartAndEndDateOfMonth() {
  var today = new Date();
  var startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  var endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { startDate, endDate };
}
