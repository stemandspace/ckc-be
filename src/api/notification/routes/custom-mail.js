module.exports = {
  routes: [
    {
      method: "POST",
      path: "/send-mail",
      handler: "notification.sendMail",
    },
  ],
};
