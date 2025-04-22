"use strict";
/**
 * profile-picture service
 */
const { createCoreService } = require("@strapi/strapi").factories;
module.exports = createCoreService(
  "api::profile-picture.profile-picture",
  () => {
    return {
      // Logic :
      // 1. Remove the previous profile picture
      // 2. Upload the new profile picture
      // 3. Return the new profile picture
      async removePreviousProfilePicture(userId) {
        const previousProfilePictures = await strapi.entityService.findMany(
          "api::profile-picture.profile-picture",
          {
            filters: {
              user: userId,
            },
            populate: {
              image: true,
            },
          }
        );
        if (previousProfilePictures.length > 0) {
          const deletePromises = previousProfilePictures.map(
            async (profilePicture) => {
              console.log(profilePicture);
              // Delete the image file first
              await strapi.entityService.delete(
                "plugin::upload.file",
                profilePicture.image.id
              );
              // Delete the profile picture entry
              await strapi.entityService.delete(
                "api::profile-picture.profile-picture",
                profilePicture.id
              );
            }
          );

          await Promise.all(deletePromises);
        }
      },
      // Logic :
      // 1. Remove the previous profile picture
      // 2. Upload the new profile picture
      // 3. Return the new profile picture
      async uploadProfilePicture(userId, image) {
        await this.removePreviousProfilePicture(userId);
        const uploadedFiles =
          await strapi.plugins.upload.services.upload.upload({
            data: {
              fileInfo: {
                name: image.name,
                caption: image.caption,
                alternativeText: image.alternativeText,
              },
            },
            files: image,
          });
        if (uploadedFiles.length === 0) {
          throw new Error("Failed to upload profile picture");
        }
        const profilePicture = await strapi.entityService.create(
          "api::profile-picture.profile-picture",
          {
            data: {
              user: parseInt(userId),
              publishedAt: new Date(),
              image: uploadedFiles.at(0).id,
            },
            populate: {
              image: true,
            },
          }
        );
        return profilePicture;
      },
    };
  }
);
