module.exports = {
  myJob: {
    task: async ({ strapi }) => {
      // THIS JOB IS FOR LIVE
      try {
        const targetList = await strapi.query("api::live.live").findMany({
          where: {
            type: {
              $eq: "upcoming",
            },
          },
        });

        for (const live of targetList) {
          if (isCurrentDateTimeMatching(live.from)) {
            await strapi.query("api::live.live").update({
              where: { id: live.id },
              data: {
                type: "live",
              },
            });
          }
        }

        console.log("Processed live events:", targetList.length);
      } catch (error) {
        console.log("Error processing live events:", error);
      }

      // THIS JOB IS FOR REMAINDERS
      try {
        // Fetch reminders in batches
        const batchSize = 100; // Adjust batch size as needed
        let offset = 0;
        let targetList = [];
        let remindersBatch = [];
        const now = new Date().toISOString();

        do {
          remindersBatch = await strapi
            .query("api::reminder.reminder")
            .findMany({
              where: {
                notified: false,
                schedule: {
                  $lte: now,
                },
              },
              populate: ["user"],
              limit: batchSize,
              start: offset,
            });

          targetList = targetList.concat(remindersBatch);
          offset += batchSize;
        } while (remindersBatch.length === batchSize);

        if (targetList.length !== 0) {
          // Batch operations for creating notifications and deleting reminders
          const notificationPromises = targetList.map(async (reminder) => {
            const createNotification = strapi
              .query("api::notification.notification")
              .create({
                data: {
                  type: "email",
                  status: "unread",
                  user: reminder.user,
                  title: reminder.title,
                  publishedAt: new Date(),
                  message: reminder.message,
                },
              });

            const deleteReminder = strapi
              .query("api::reminder.reminder")
              .delete({
                where: {
                  id: reminder.id,
                },
              });

            return Promise.all([createNotification, deleteReminder]);
          });

          await Promise.all(notificationPromises);
        }

        console.log("Processed reminders:", targetList.length);
      } catch (error) {
        console.log("Error processing reminders:", error);
      }
    },

    options: {
      rule: "*/15 * * * *", // Adjust cron rule as needed
    },
  },
};

function isCurrentDateTimeMatching(date) {
  // Get the current date
  const currentDate = new Date();
  const targetDate = new Date(date);

  // Extract year, month, day, hour, and minutes from the current date
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Month is zero-indexed, so add 1
  const currentDay = currentDate.getDate();
  const currentHour = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();

  // Extract year, month, day, hour, and minutes from the target date
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;
  const targetDay = targetDate.getDate();
  const targetHour = targetDate.getHours();
  const targetMinutes = targetDate.getMinutes();

  // Compare the dates, hours, and minutes
  return (
    currentYear === targetYear &&
    currentMonth === targetMonth &&
    currentDay === targetDay &&
    currentHour === targetHour &&
    currentMinutes === targetMinutes
  );
}
