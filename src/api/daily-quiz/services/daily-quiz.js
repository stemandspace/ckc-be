"use strict";

/**
 * daily-quiz service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::daily-quiz.daily-quiz", () => ({
  // get quiz by difficulty - max 1
  getQuizByDifficulty: async (difficulty) => {
    const publish_date = new Date(Date.now()).toISOString();
    const quiz = await strapi.db.query("api::daily-quiz.daily-quiz").findOne({
      where: {
        publish_date,
        difficulty,
      },
      populate: {
        questions: true,
      },
    });

    // validate length
    if (quiz.questions.length == 0) {
      return null;
    }
    return quiz;
  },

  // validate quiz attempt
  validateQuizAttempt: async (userId) => {
    if (!userId) {
      throw new Error("userId is required");
    }
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);
    const attempt = await strapi.db
      .query("api::daily-quiz-attemp.daily-quiz-attemp")
      .findOne({
        where: {
          user_id: userId || 0,
          publishedAt: {
            $gte: startOfDay.toISOString(),
            $lt: endOfDay.toISOString(),
          },
        },
      });
    return attempt;
  },

  // bulk upload and publish quizzes
  bulkUploadQuizzes: async (quizzes) => {
    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      throw new Error("quizzes must be a non-empty array");
    }

    const results = {
      success: [],
      failed: [],
      total: quizzes.length,
    };

    for (let i = 0; i < quizzes.length; i++) {
      const quiz = quizzes[i];
      try {
        // Validate required fields
        if (
          !quiz.title ||
          !quiz.description ||
          !quiz.variable_score ||
          !quiz.publish_date ||
          !quiz.difficulty
        ) {
          throw new Error(
            `Quiz ${
              i + 1
            }: Missing required fields (title, description, variable_score, publish_date, difficulty)`
          );
        }

        // Validate difficulty enum
        if (!["easy", "medium", "hard"].includes(quiz.difficulty)) {
          throw new Error(
            `Quiz ${
              i + 1
            }: Invalid difficulty. Must be one of: easy, medium, hard`
          );
        }

        // Validate questions
        if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
          throw new Error(`Quiz ${i + 1}: Questions must be a non-empty array`);
        }

        // Validate each question
        for (let j = 0; j < quiz.questions.length; j++) {
          const question = quiz.questions[j];
          if (
            !question.name ||
            !question.option1 ||
            !question.option2 ||
            !question.answer
          ) {
            throw new Error(
              `Quiz ${i + 1}, Question ${
                j + 1
              }: Missing required fields (name, option1, option2, answer)`
            );
          }
          if (question.name.length < 20 || question.name.length > 100) {
            throw new Error(
              `Quiz ${i + 1}, Question ${
                j + 1
              }: Name must be between 20 and 100 characters`
            );
          }
        }

        // Format publish_date to ISO string if it's not already
        let publishDate = quiz.publish_date;
        if (typeof publishDate === "string") {
          publishDate = new Date(publishDate).toISOString().split("T")[0];
        } else if (publishDate instanceof Date) {
          publishDate = publishDate.toISOString().split("T")[0];
        }

        // Prepare quiz data
        const quizData = {
          title: quiz.title,
          description: quiz.description,
          variable_score: parseInt(quiz.variable_score),
          publish_date: publishDate,
          difficulty: quiz.difficulty,
          questions: quiz.questions.map((q) => ({
            name: q.name,
            option1: q.option1,
            option2: q.option2,
            option3: q.option3 || null,
            option4: q.option4 || null,
            answer: q.answer,
          })),
        };

        // Add reward if provided
        if (quiz.reward) {
          quizData.reward = quiz.reward;
        }

        // Create and publish the quiz
        const createdQuiz = await strapi.entityService.create(
          "api::daily-quiz.daily-quiz",
          {
            data: quizData,
          }
        );

        // Publish the quiz
        const publishedQuiz = await strapi.entityService.update(
          "api::daily-quiz.daily-quiz",
          createdQuiz.id,
          {
            data: {
              publishedAt: new Date(),
            },
          }
        );

        results.success.push({
          index: i + 1,
          id: publishedQuiz.id,
          title: publishedQuiz.title,
          difficulty: publishedQuiz.difficulty,
          publish_date: publishedQuiz.publish_date,
          questions_count:
            // @ts-ignore
            publishedQuiz.questions?.length ?? quiz.questions.length,
        });
      } catch (error) {
        results.failed.push({
          index: i + 1,
          error: error.message || "Unknown error",
          title: quiz.title || "Unknown",
        });
      }
    }

    return results;
  },
}));
