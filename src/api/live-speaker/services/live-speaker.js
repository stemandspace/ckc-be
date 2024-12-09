'use strict';

/**
 * live-speaker service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::live-speaker.live-speaker');
