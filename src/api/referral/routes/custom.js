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
      path: "/premium-purchase-referral-credits",
      handler: "premium-purchase-referral.getRefCredit",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
