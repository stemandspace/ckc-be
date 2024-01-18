'use strict';

/**
 * top-up service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::top-up.top-up');
