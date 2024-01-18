module.exports = {
  routes: [
    {
      method: "GET",
      path: "/recent-watched",
      handler: "recent-watched.getRecentWached",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
