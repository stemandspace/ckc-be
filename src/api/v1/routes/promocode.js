module.exports = {
  routes: [
    {
      method: "POST",
      path: "/promocode/applicable",
      handler: "promocode.applicable",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
