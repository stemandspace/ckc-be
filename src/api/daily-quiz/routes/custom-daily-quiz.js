module.exports = {
  routes: [
    {
      // curl --location 'http://localhost:1337/api/daily-quiz/filter?difficulty=easy&userId=7310'
      method: "GET",
      path: "/daily-quiz/filter",
      handler: "custom-daily-quiz.filterDailyQuiz",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
