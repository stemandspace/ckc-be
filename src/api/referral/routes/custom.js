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
    {
      method: "POST",
      path: "/get-referral-credits",
      handler: "get-referral-credits.getRefCredit",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
