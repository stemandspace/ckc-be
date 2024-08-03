'use strict';

/**
 * nac-registration service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::nac-registration.nac-registration');
