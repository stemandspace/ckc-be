'use strict';

/**
 * watched router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::watched.watched');
