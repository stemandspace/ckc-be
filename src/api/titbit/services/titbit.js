'use strict';

/**
 * titbit service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::titbit.titbit');
