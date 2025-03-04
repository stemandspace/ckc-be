'use strict';

/**
 * mail-template service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::mail-template.mail-template');
