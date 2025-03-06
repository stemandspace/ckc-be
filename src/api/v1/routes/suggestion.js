module.exports = {
  routes: [
    {
      method: "GET",
      path: "/v1/suggestion",
      handler: "suggestion.getSuggestion",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
