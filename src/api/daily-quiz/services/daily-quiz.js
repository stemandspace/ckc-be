'use strict';

/**
 * daily-quiz service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::daily-quiz.daily-quiz');
