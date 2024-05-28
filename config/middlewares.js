module.exports = [
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "frame-src": [
            "'self'",
            "youtube.com",
            "www.youtube.com",
            "vimeo.com",
            "*.vimeo.com",
            "facebook.com",
            "www.facebook.com",
          ],
          "connect-src": ["'self'", "https:"],
          "img-src": ["'self'", "data:", "blob:", "*.amazonaws.com", "*"],
          "media-src": ["'self'", "data:", "blob:", "*.amazonaws.com"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "strapi::errors",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
