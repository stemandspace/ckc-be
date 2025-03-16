module.exports = {
  routes: [
    {
      method: "GET",
      path: "/v1/logger",
      handler: "logger.Logger",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
