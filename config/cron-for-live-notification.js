module.exports = {
  myJob: {
    task: async ({ strapi }) => {
      // THIS JOB IS FOR LIVE SESSION NOTIFICATION
      console.log("CRON is running")
      try {
        const now = new Date();
        // Fetch upcoming live sessions
        const targetList = await strapi.query("api::live.live").findMany({
          where: {
            type: { $eq: "upcoming" },
            from: {
              $gt: now.toISOString(),
              $lt: new Date(
                new Date().setDate(now.getDate() + 2)
              ).toISOString(),
            },
          },
        });

        // Format live session data
        const fLive = targetList.map((l) => ({
          id: l.id,
          title: l?.title,
          from: l.from,
          to: l.to,
          timeLeft: howMuchTimeLeft(l.from),
        }));

        // Extract live session IDs for filtering reminders
        const liveSessionIds = fLive.map((live) => live.id);

        // Fetch reminders related to the live sessions
        const relatedReminders = await strapi
          .query("api::reminder.reminder")
          .findMany({
            where: {
              notified: false,
              contentId: { $in: liveSessionIds },
            },
            populate: ["user"],
          });

        if (relatedReminders.length > 0) {
          // Prepare notifications data
          const notificationsData = relatedReminders.map((reminder) => {
            const liveSession = fLive.find(
              (live) => Number(live.id) === Number(reminder.contentId)
            );
            const timeLeft = liveSession ? liveSession.timeLeft : "Unknown";
            return {
              mail_template: 3,
              status: "unread",
              user: reminder.user.id,
              subject: liveSession?.title,
              publishedAt: now,
              body: `${liveSession?.title} - Starting in ${timeLeft}!`,
              channel: "mail",
              variables: {
                name: `${reminder.user.firstname} ${reminder.user.lastname}`,
                email: reminder.user.email,
                variables: {},
              },
            };
          });

          // Insert notifications in bulk

          const notificationPromise = await Promise.all(
            notificationsData.map(async (dt) => {
              return await strapi
                .query("api::notificationx.notificationx")
                .create({
                  data: dt,
                });
            })
          );

          //console.log({ notificationPromise });

          // Update all processed reminders
          const reminderIds = relatedReminders.map((reminder) => reminder.id);
          await strapi.query("api::reminder.reminder").updateMany({
            where: { id: { $in: reminderIds } },
            data: { notified: true },
          });
        }
      } catch (error) {
        console.log("Error processing reminders:", error);
      }
    },

    options: {
      rule: "0 12 * * *",
    },
  },
};

function howMuchTimeLeft(sessionDate) {
  const currentDate = new Date();
  const targetDate = new Date(sessionDate);
  // @ts-ignore
  const timeDifference = targetDate - currentDate;
  const daysLeft = Math.floor(timeDifference / 86400000);

  if (daysLeft > 0) return `${daysLeft} day`;

  const hoursLeft = Math.floor((timeDifference % 86400000) / 3600000);
  const minutesLeft = Math.floor((timeDifference % 3600000) / 60000);

  return hoursLeft > 0
    ? `${hoursLeft} hours and ${minutesLeft} minutes`
    : `${minutesLeft} minutes`;
}
