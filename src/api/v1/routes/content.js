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
  ],
};
