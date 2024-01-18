'use strict';

/**
 * nac service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::nac.nac');
