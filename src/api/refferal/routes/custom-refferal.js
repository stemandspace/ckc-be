module.exports = {
  type: "admin",
  routes: [
    {
      // refferal, refferee - params reequired.
      method: "POST",
      path: "/refferal/create",
      handler: "custom-refferal.createRefferal",
    },
    {
      method: "POST",
      path: "/refferal/validate",
      handler: "custom-refferal.validateRefferal",
    },
    {
      method: "GET",
      path: "/refferal/info",
      handler: "custom-refferal.getRefferalInfo",
    },
  ],
};
