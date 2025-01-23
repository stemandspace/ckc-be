module.exports = {
  routes: [
    {
      method: "GET",
      path: "/daily-spin/attempt",
      handler: "get-spin-attempt.getSpinAttempt",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
