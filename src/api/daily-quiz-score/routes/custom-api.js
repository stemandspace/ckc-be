module.exports = {
  routes: [
    {
      method: "GET",
      path: "/daily-quiz-score/score",
      handler: "get-score.getScore",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
