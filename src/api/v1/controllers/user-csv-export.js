const converter = require("json-2-csv");
/**
 * @typedef {import('@strapi/strapi').Strapi} Strapi
 * @typedef {import('koa').Context} Context
 */

/**
 * NAC custom APIs
 * @param {{ strapi: Strapi }} param0 - Strapi instance.
 * @returns {Object} Controller methods.
 */
const controller = ({ strapi }) => ({
  /**
   * Create Razorpay Order
   * @param {Context} ctx - Koa context
   * @returns {Promise<any>}
   */
  async exportUserCsv(ctx) {
    try {
      const users = await strapi.entityService.findMany(
        "plugin::users-permissions.user",
        {
          fields: [
            "firstname",
            "lastname",
            "email",
            "mobile",
            "grade",
            "type",
            "country",
            "state",
            "city",
            "createdAt",
          ],
          sort: ["createdAt:desc"],
        }
      );
      const csv = converter.json2csv(users);
      ctx.set("Content-Type", "text/csv");
      ctx.set("Content-Disposition", "attachment; filename=users.csv");
      ctx.body = csv;
    } catch (error) {
      ctx.throw(500, error);
    }
  },
});

module.exports = controller;

// User Data Export API (CSV Download)
// The system includes an API endpoint designed to extract user details and generate a downloadable CSV file. This feature is useful for admins or authorized users who need to analyze or manage user information externally.

// CSV includes the following fields:

// Name

// Email

// Phone

// Grade

// Subscription Status

// Country

// State

// City

// Created At

// Key Features:

// Accessible via a secure API route.

// Automatically formats and exports user data in CSV format.

// Supports large datasets with efficient data processing.

// Can be integrated into admin dashboards for one-click downloads.

// This feature simplifies user data reporting, backup, or offline analysis, making it easy to manage and audit user records when needed.
