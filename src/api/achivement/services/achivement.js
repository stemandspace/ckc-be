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
              select: [
                "id",
                "firstname",
                "lastname",
                "avatar",
                "username",
                "grade",
              ],
            },
          },
          pageSize: 100000,
        });

      const badgeFindAchievement = await Promise.all(
        achievements.map(async (achivement) => {
          if (achivement.contentType === "badge") {
            const badge = await strapi.db.query("api::badge.badge").findOne({
              where: {
                id: Number(achivement.contentId),
              },
              populate: {
                media: true,
              },
            });
            return { ...achivement, badge: badge?.media?.url };
          }
          return { ...achivement, badge: null };
        })
      );

      const dataMap = new Map();

      badgeFindAchievement.forEach((achievement) => {
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
              grade: achievement?.user?.grade,
              badge: [],
            });
          }
          if (achievement.transectionType == "dr") {
            dataMap.get(userId).points += coins;
          }
          if (achievement.badge) {
            dataMap.get(userId).badge.push(achievement?.badge);
          }
        }
      });

      const sortedLeaderboard = Array.from(dataMap.values()).sort(
        (a, b) => b?.points - a?.points
      );
      const addRankInLeaderboard = sortedLeaderboard.map((_, index) => {
        return {
          ..._,
          rank: index + 1,
        };
      });

      return addRankInLeaderboard;
    } catch (err) {
      console.log("leaderboard get error:-> ", err);
    }
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
