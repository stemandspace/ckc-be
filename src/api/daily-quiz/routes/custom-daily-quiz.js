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
    {
      // curl --location 'http://localhost:1337/api/daily-quiz/bulk-upload' \
      // --header 'Content-Type: application/json' \
      // --data '{"quizzes": [...]}'
      method: "POST",
      path: "/daily-quiz/bulk-upload",
      handler: "custom-daily-quiz.bulkUploadQuizzes",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
