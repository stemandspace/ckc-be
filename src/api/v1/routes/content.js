module.exports = {
  routes: [
    {
      method: "GET",
      path: "/get-content",
      handler: "content.getContent",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/content",
      handler: "content.getById",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
