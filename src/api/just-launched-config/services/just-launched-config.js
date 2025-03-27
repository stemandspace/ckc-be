'use strict';

/**
 * just-launched-config service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::just-launched-config.just-launched-config');
