'use strict';

/**
 * control service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::control.control');
