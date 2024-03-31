module.exports = ({ env }) => ({
  transformer: {
    enabled: true,
    config: {
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      },
      requestTransforms: {
        wrapBodyWithDataKey: true,
      },
      hooks: {
        preResponseTransform: (ctx) => {},
        postResponseTransform: (ctx) => {},
      },

      plugins: {
        ids: {
          slugify: true,
        },
      },
    },
  },
  io: {
    enabled: true,
    config: {
      contentTypes: ["api::notification.notification"],
    },
  },
  "fuzzy-search": {
    enabled: true,
    config: {
      contentTypes: [
        {
          uid: "api::course.course",
          modelName: "course",
          transliterate: true,
          fuzzysortOptions: {
            characterLimit: 500,
            keys: [
              {
                name: "title",
                weight: 100,
              },
              {
                name: "grade",
                weight: 100,
              },
            ],
          },
        },
        {
          uid: "api::video.video",
          modelName: "video",
          fuzzysortOptions: {
            characterLimit: 500,
            keys: [
              {
                name: "title",
                weight: 100,
              },
              {
                name: "grade",
                weight: 100,
              },
            ],
          },
        },
        {
          uid: "api::comic.comic",
          modelName: "comic",
          fuzzysortOptions: {
            characterLimit: 500,
            keys: [
              {
                name: "title",
                weight: 100,
              },
              {
                name: "grade",
                weight: 100,
              },
            ],
          },
        },
        {
          uid: "api::nac.nac",
          modelName: "nac",
          fuzzysortOptions: {
            characterLimit: 500,
            keys: [
              {
                name: "title",
                weight: 100,
              },
              {
                name: "grade",
                weight: 100,
              },
            ],
          },
        },
        {
          uid: "api::live.live",
          modelName: "live",
          fuzzysortOptions: {
            characterLimit: 500,
            keys: [
              {
                name: "title",
                weight: 100,
              },
              {
                name: "grade",
                weight: 100,
              },
            ],
          },
        },
      ],
    },
  },
  "import-export-entries": {
    enabled: true,
    config: {
      // See `Config` section.
    },
  },
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        baseUrl: "https://s3.us-east-1.amazonaws.com/myckc",
        rootPath: "myckc",
        s3Options: {
          accessKeyId: env("AWS_ACCESS_KEY_ID"),
          secretAccessKey: env("AWS_ACCESS_SECRET"),
          region: env("AWS_REGION"),
          params: {
            // ACL: env("AWS_ACL", "public-read"),
            signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
            Bucket: env("AWS_BUCKET"),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  email: {
    config: {
      provider: "amazon-ses",
      providerOptions: {
        key: env("AWS_SES_ACCESS_KEY_ID"),
        secret: env("AWS_SES_ACCESS_SECRET"),
        amazon: "https://email.us-east-1.amazonaws.com",
      },
      settings: {
        defaultFrom: "hello@cosmickidsclub.in",
        defaultReplyTo: "hello@cosmickidsclub.in",
      },
    },
  },
  "video-field": {
    enabled: true,
  },
});
