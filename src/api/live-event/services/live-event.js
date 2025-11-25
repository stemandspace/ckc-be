'use strict';

/**
 * live-event service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::live-event.live-event');
