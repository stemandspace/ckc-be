module.exports = {
  routes: [
    {
      method: "GET",
      path: "/leaderboard", // Only match when the URL parameter is composed of lowercase letters
      handler: "achivement.leaderboard",
    },
  ],
};
