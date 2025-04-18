'use strict';

/**
 * profile-picture service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::profile-picture.profile-picture');
