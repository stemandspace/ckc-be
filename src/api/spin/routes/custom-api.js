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
    {
      method: "POST",
      path: "/daily-spin/create-attempt",
      handler: "create-spin-attempt.createQuizAttempt",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
