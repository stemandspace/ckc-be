module.exports = {
  routes: [
    {
      method: "GET",
      path: "/v1/session",
      handler: "session.getUserData",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
