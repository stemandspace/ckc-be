module.exports = {
  routes: [
    {
      method: "GET",
      path: "/mypurchase/:userId", // Only match when the URL parameter is composed of lowercase letters
      handler: "purchase.mypurchase",
    },
    {
      method: "POST",
      path: "/buypremium", // Only match when the URL parameter is composed of lowercase letters
      handler: "purchase.buyPremium",
    },
  ],
};
