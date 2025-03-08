module.exports = {
  routes: [
    {
      method: "POST",
      path: "/transaction/order", // Only match when the URL parameter is composed of lowercase letters
      handler: "transaction.createRzOrder",
    },
    {
      method: "POST",
      path: "/transaction/webhook", // Only match when the URL parameter is composed of lowercase letters
      handler: "transaction.handleWebhook",
    },
  ],
};
