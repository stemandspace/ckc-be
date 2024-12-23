module.exports = {
  routes: [
    {
      method: "POST",
      path: "/v1/logger",
      handler: "logger.Logger",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
