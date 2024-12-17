module.exports = {
  routes: [
    {
      method: "GET",
      path: "/like",
      handler: "like.getLike",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/like-count",
      handler: "like.getLikeCount",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/like",
      handler: "like.setLike",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
