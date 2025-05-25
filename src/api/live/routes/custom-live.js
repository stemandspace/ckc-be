module.exports = {
  routes: [
    {
      // curl : http://localhost:1337/api/live/active-live-info
      method: "GET",
      path: "/live/active-live-info",
      handler: "custom-live.getActiveLiveInfo",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
