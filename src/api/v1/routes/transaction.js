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
  ],
};
