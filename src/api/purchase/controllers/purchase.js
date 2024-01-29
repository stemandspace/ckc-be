"use strict";
const { v4: uuidv4 } = require("uuid");

/**
 * purchase controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const queryPaths = {
  video: "api::video.video",
  comic: "api::comic.comic",
  course: "api::course.course",
  live: "api::live.live",
  module: "api::course.course",
};

module.exports = createCoreController(
  "api::purchase.purchase",
  ({ strapi }) => ({
    mypurchase: async (ctx, next) => {
      try {
        const { userId } = ctx.params;
        // Fetch recent watched items by user id
        const purchased = await strapi
          .query("api::purchase.purchase")
          .findMany({
            where: { user: userId },
          });
        if (purchased.length > 0) {
          // Fetch additional details for each recent watched item
          const enrichedRecentWatched = await Promise.all(
            purchased.map(async (watchedItem) => {
              const contentPath = queryPaths[watchedItem.type];
              if (!contentPath) return null;

              const contentDetails = await strapi.query(contentPath).findOne({
                where: { id: watchedItem.content_id },
                populate: ["thumbnail"],
              });

              if (contentDetails) {
                contentDetails.type = watchedItem.type;
                return contentDetails;
              }
              return null;
            })
          );

          const validEnrichedRecentWatched = enrichedRecentWatched.filter(
            (item) => item !== null
          );
          if (validEnrichedRecentWatched.length > 0) {
            ctx.body = validEnrichedRecentWatched;
          } else {
            ctx.body = {
              message:
                "No valid content details found for recent purchase items.",
            };
          }
        } else {
          ctx.body = { message: "No recent purchases items found." };
        }
      } catch (err) {
        ctx.body = { error: err.message || "Internal Server Error" };
      }
    },

    buyPremium: async (ctx, next) => {
      try {
        const { plan, title, userId, days, type, credits, amount } =
          ctx.request.body.data;
        const tsxid = uuidv4();
        const endStampTimestamp = Math.floor(
          new Date().setDate(new Date().getDate() + days) / 1000
        );
        // Validate plan and paymentMethodId

        // Generate a random tsxid using UUID

        // Implement logic to create a subscription record in the database
        const subscription = await strapi
          .query("api::subscription.subscription")
          .create({
            data: {
              title,
              user_id: userId,
              plan: plan,
              tsxid: tsxid,
              end_stamp: endStampTimestamp,
              publishedAt: new Date(),
            },
          });

        const newPurchase = await strapi
          .query("api::real-purchase.real-purchase")
          .create({
            data: {
              user_id: userId.toString(),
              purchase_id: Math.random().toString(36).substr(2, 9),
              amount,
              status: "paid",
              label: title,
              publishedAt: new Date(),
              type,
            },
          });

        const user = await strapi
          .query("plugin::users-permissions.user")
          .findOne({
            where: { id: userId },
            populate: ["credits"],
          });
        const updatedCoins = parseInt(user.credits) + parseInt(credits);

        user.credits = updatedCoins;

        // Optionally, update the user's premium status or other details
        await strapi.query("plugin::users-permissions.user").update({
          where: { id: userId },
          data: {
            premium: endStampTimestamp,
            type: type,
            credits: updatedCoins,
          },
        });

        // Respond with the created subscription details
        ctx.body = subscription;
      } catch (err) {
        ctx.body = { error: err.message || "Internal Server Error" };
      }
    },
  })
);
