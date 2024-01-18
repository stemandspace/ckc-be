module.exports = {
  routes: [
    {
      method: "POST",
      path: "/credit",
      handler: "credit.buyCredit",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/credit",
      handler: "credit.getCredits",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
