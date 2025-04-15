module.exports = {
  routes: [
    {
      method: "GET",
      path: "/v1/user-csv-export",
      handler: "user-csv-export.exportUserCsv",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
