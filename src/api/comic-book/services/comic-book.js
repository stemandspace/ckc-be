'use strict';

/**
 * comic-book service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::comic-book.comic-book');
