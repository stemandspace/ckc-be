module.exports = {
  routes: [
    {
      method: "POST",
      path: "/generate-notification",
      handler: "notification.createNotifcation",
    },
  ],
};
