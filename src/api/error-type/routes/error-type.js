'use strict';

/**
 * error-type router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::error-type.error-type');
