"use strict";

/**
 * watched controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::watched.watched", {
  async update(ctx) {
    const { id } = ctx.params;
    const { watch_progress } = ctx.request.body.data;
    // Fetch the existing watched entry
    const existingWatched = await strapi.query("api::watched.watched").findOne({
      where: { id: id },
    });
    if (!existingWatched) {
      return ctx.notFound("Watched entry not found");
    }
    // Check if the new watch_progress is greater than the existing value
    if (watch_progress > parseInt(existingWatched.watch_progress)) {
      const response = await super.update(ctx);
      return response;
    } else {
      return ctx.send({
        message:
          "New watch_progress is not greater than the existing value. Progress not updated.",
      });
    }
  },
});
