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
