module.exports = {
  routes: [
    {
      method: "GET",
      path: "/daily-quiz/today",
      handler: "get-todays-quiz.getTodaysQuiz",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
