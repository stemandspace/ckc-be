module.exports = {
  routes: [
    {
      method: "POST",
      path: "/v1/reward",
      handler: "reward.reward",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
