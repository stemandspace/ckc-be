'use strict';

/**
 * daily-spin service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::daily-spin.daily-spin');
