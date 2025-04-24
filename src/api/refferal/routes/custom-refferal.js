module.exports = {
  type: "admin",
  routes: [
    {
      method: "POST",
      path: "/refferal/create",
      handler: "custom-refferal.createRefferal",
    },
    {
      method: "POST",
      path: "/refferal/validate",
      handler: "custom-refferal.validateRefferal",
    },
  ],
};
