module.exports = {
  routes: [
    {
      // postman curl : curl --location 'http://localhost:1337/api/titbits/categories'
      method: "GET",
      path: "/titbits/categories",
      handler: "custom-titbits.getTitbitsCategories",
    },
    {
      // postman curl : curl --location 'http://localhost:1337/api/titbits/category?id=1&page=1&pageSize=10'
      method: "GET",
      path: "/titbits/category",
      handler: "custom-titbits.getTitbitsByCategory",
    },
    {
      // postman curl : curl --location 'http://localhost:1337/api/titbits/titbit?id=1'
      method: "GET",
      path: "/titbits/titbit",
      handler: "custom-titbits.getTitbitById",
    },
  ],
};
