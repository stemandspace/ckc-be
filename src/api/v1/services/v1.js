'use strict';

/**
 * v1 service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::v1.v1');
