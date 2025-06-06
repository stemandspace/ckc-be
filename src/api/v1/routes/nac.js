module.exports = {
  routes: [
    {
      method: "POST",
      path: "/nac/registration",
      handler: "nac.registration",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/nac/registrations",
      handler: "nac.registrations",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/nac/webhook",
      handler: "nac.webhook",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
