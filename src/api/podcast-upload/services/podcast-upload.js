'use strict';

/**
 * podcast-upload service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::podcast-upload.podcast-upload');
