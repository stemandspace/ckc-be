module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  myJob: {
    task: async ({ strapi }) => {
      const targetList = await strapi.query("api::live.live").findMany({
        where: {
          type: {
            $eq: "upcoming",
          },
        },
      });

      Array.isArray(targetList) &&
        targetList
          .filter((item) => isCurrentDateTimeMatching(item.from))
          .forEach(async (live) => {
            await strapi.query("api::live.live").update({
              where: { id: live.id },
              data: {
                type: "live",
              },
            });
          });
    },
    options: {
      rule: "*/15 * * * *",
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
