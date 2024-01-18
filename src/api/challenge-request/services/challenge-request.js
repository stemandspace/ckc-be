'use strict';

/**
 * challenge-request service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::challenge-request.challenge-request');
