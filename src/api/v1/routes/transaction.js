module.exports = {
  routes: [
    {
      method: "POST",
      path: "/v1/transaction/create",
      handler: "transaction.createTransaction",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/v1/transaction/webhook",
      handler: "transaction.webhook",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
