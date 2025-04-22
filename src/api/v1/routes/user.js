module.exports = {
  routes: [
    {
      method: "POST",
      path: "/v1/user/profile-picture",
      handler: "user.uploadProfilePicture",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
