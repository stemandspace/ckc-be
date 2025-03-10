module.exports = {
  routes: [
    {
      method: "GET",
      path: "/cron-test",
      handler: "cron-test.cronTest",
      config: {
        policies: [],
        middlewares: [],
      },
    },
 
  ],
};
