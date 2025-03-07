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
    {
      method: "GET",
      path: "/v1/time-tracking-reward",
      handler: "get-ttr.getTTR",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
