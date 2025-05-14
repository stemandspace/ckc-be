module.exports = {
  routes: [
    {
      // userId, difficulty [easy,medium,hard] required;
      method: "GET",
      path: "/daily-quiz/filter",
      handler: "custom-daily-quiz.filterDailyQuiz",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
