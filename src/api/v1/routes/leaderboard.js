module.exports = {
  routes: [
    {
      method: "GET",
      path: "/v1/leaderboard",
      handler: "leaderboard.globalLeaderboard",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/v1/daily-quiz-leaderboard",
      handler: "daily-quiz-leaderboard.quizLeaderboard",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
