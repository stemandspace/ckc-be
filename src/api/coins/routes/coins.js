module.exports = {
  routes: [
    {
      method: "POST",
      path: "/coins",
      handler: "coins.updateCoinsAndUnlockVideo",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/coins/virtual-purchase",
      handler: "coins.VirtualPurchase",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/coins",
      handler: "coins.getCoins",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/virtual-purchase",
      handler: "coins.getVirtualPurchase",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
