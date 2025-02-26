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
  ],
};
