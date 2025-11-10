"use strict";

const controller = ({ strapi }) => ({
  async filterDailyQuiz(ctx) {
    try {
      const { difficulty, userId } = ctx.request.query;

      if (!difficulty || !userId) {
        return ctx.send({ error: "difficulty and userId are required" }, 400);
      }

      const attempt = await strapi
        .service("api::daily-quiz.daily-quiz")
        .validateQuizAttempt(userId);

      const quiz = await strapi
        .service("api::daily-quiz.daily-quiz")
        .getQuizByDifficulty(difficulty);

      const score = await strapi
        .service("api::daily-quiz-score.daily-quiz-score")
        .getDailyQuizScore(userId);

      return ctx.send(
        {
          quiz,
          score,
          attempt,
        },
        200
      );
    } catch (err) {
      console.error(err);
      ctx.internalServerError("An error occurred during fetching daily quiz.");
    }
  },

  async bulkUploadQuizzes(ctx) {
    try {
      // Debug: Log the request body to see what we're receiving
      console.log("Request body:", JSON.stringify(ctx.request.body, null, 2));
      console.log("Request body type:", typeof ctx.request.body);
      console.log("Request body keys:", Object.keys(ctx.request.body || {}));

      let quizzesArray = null;
      const body = ctx.request.body;

      // Handle different possible body structures
      // Case 1: Body is directly an array
      if (Array.isArray(body)) {
        quizzesArray = body;
      }
      // Case 2: Body has quizzes property directly
      else if (body && body.quizzes && Array.isArray(body.quizzes)) {
        quizzesArray = body.quizzes;
      }
      // Case 3: Body has data.quizzes (Strapi format)
      else if (
        body &&
        body.data &&
        body.data.quizzes &&
        Array.isArray(body.data.quizzes)
      ) {
        quizzesArray = body.data.quizzes;
      }
      // Case 4: Body.data is directly an array
      else if (body && body.data && Array.isArray(body.data)) {
        quizzesArray = body.data;
      }

      if (!quizzesArray || !Array.isArray(quizzesArray)) {
        return ctx.send(
          {
            error: "quizzes must be provided as an array in the request body",
            received: {
              body: ctx.request.body,
              bodyType: typeof ctx.request.body,
              bodyKeys: Object.keys(ctx.request.body || {}),
            },
            example: {
              quizzes: [
                {
                  title: "Sample Quiz",
                  description: "Quiz description",
                  variable_score: 100,
                  publish_date: "2024-01-01",
                  difficulty: "easy",
                  questions: [
                    {
                      name: "What is the capital of France?",
                      option1: "London",
                      option2: "Paris",
                      option3: "Berlin",
                      option4: "Madrid",
                      answer: "Paris",
                    },
                  ],
                },
              ],
            },
          },
          400
        );
      }

      const results = await strapi
        .service("api::daily-quiz.daily-quiz")
        .bulkUploadQuizzes(quizzesArray);

      return ctx.send(
        {
          message: `Bulk upload completed. ${results.success.length} successful, ${results.failed.length} failed out of ${results.total} total.`,
          results,
        },
        200
      );
    } catch (err) {
      console.error(err);
      return ctx.send(
        {
          error: "An error occurred during bulk upload",
          message: err.message,
        },
        500
      );
    }
  },
});

module.exports = controller;
