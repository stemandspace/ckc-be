module.exports = {
  routes: [
    {
      method: "GET",
      path: "/daily-spin/config",
      handler: "get-daily-spin.getDailySpin",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
