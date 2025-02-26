module.exports = {
  routes: [
    {
      method: "POST",
      path: "/create-referral",
      handler: "create-referral.createReferral",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
