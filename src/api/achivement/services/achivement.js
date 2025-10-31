"use strict";

/**
 * achivement service
 */
const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::achivement.achivement", () => ({
  // type = weekly | monthly | overall
  calculateGlobalLeaderboard: async (type = "overall") => {
    try {
      var monthDates = getStartAndEndDateOfMonth();

      const whereFilter = {
        overall: {
          transectionAmount: {
            $gt: 0,
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
              populate: {
                profile_picture: {
                  populate: {
                    image: true,
                  },
                },
              },
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
            // Implement fallback logic: profile_picture → avatar → default image
            const defaultImageUrl =
              "https://s3.us-east-1.amazonaws.com/myckc/myckc/thumbnail_icon_7797704_640_bb50e52cbd.png?updatedAt=2025-10-06T05%3A01%3A03.127Z";

            const profilePictureUrl =
              achievement?.user?.profile_picture?.image?.formats?.small?.url ??
              achievement?.user?.profile_picture?.image?.url ??
              null;

            const avatarUrl = achievement?.user?.avatar;

            // Determine the final image URL with fallback logic
            const finalImageUrl =
              profilePictureUrl || avatarUrl || defaultImageUrl;

            dataMap.set(userId, {
              points: 0,
              id: userId,
              avatar: finalImageUrl,
              username: achievement?.user?.username,
              grade: achievement?.user?.grade || "1",
              lastname: achievement?.user?.lastname || "user",
              firstname: achievement?.user?.firstname || "spacetopia",
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

function getStartAndEndDateOfMonth() {
  var today = new Date();
  var startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  var endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { startDate, endDate };
}
