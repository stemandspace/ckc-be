'use strict';

/**
 * control controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::control.control');
