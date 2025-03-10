module.exports = {
  routes: [
    {
      method: "GET",
      path: "/v1/referrals",
      handler: "get-referrals.getReferrals",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
