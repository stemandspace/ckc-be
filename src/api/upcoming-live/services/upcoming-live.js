'use strict';

/**
 * upcoming-live service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::upcoming-live.upcoming-live');
