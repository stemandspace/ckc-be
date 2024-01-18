'use strict';

/**
 * recorded-live service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::recorded-live.recorded-live');
