'use strict';

/**
 * real-purchase service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::real-purchase.real-purchase');
