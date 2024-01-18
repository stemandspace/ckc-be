'use strict';

/**
 * top-up router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::top-up.top-up');
