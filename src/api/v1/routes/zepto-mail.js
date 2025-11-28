module.exports = {
  routes: [
    {
      method: "POST",
      path: "/v1/zepto-mail",
      handler: "zepto-mail.sendMail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
