module.exports = {
  routes: [
    {
      method: "POST",
      path: "/transaction/order", // Only match when the URL parameter is composed of lowercase letters
      handler: "trans.createRzOrder",
    },
    {
      method: "POST",
      path: "/transaction/webhook", // Only match when the URL parameter is composed of lowercase letters
      handler: "trans.handleWebhook",
    },
    {
      method: "GET",
      path: "/credit-balance", // Only match when the URL parameter is composed of lowercase letters
      handler: "trans.getCredits",
    },
    {
      method: "GET",
      path: "/active-membership", // Only match when the URL parameter is composed of lowercase letters
      handler: "trans.getActiveMembership",
    },
  ],
};
