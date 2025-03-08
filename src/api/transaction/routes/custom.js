module.exports = {
  routes: [
    {
      method: "POST",
      path: "/transaction/order", // Only match when the URL parameter is composed of lowercase letters
      handler: "transaction.createRzOrder",
    },
  ],
};
