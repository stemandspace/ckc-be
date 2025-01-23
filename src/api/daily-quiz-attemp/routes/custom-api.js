module.exports = {
  routes: [
    {
      method: "POST",
      path: "/daily-quiz-attempt/create-quiz-attempt",
      handler: "create-attempt.createQuizAttempt",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
