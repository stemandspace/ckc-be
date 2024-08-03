'use strict';

/**
 * school-registration service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::school-registration.school-registration');
