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
    enabled: false,
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
        region: env("AWS_REGION"),
        accessKeyId: env("AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_ACCESS_SECRET"),
      },
      settings: {
        defaultFrom: "hello@cosmickids.club",
        defaultReplyTo: "hello@cosmickids.club",
      },
    },
  },
  "video-field": {
    enabled: true,
  },
  treblle: {
    config: {
      routesToMonitor: ["api"], // this is the default
    },
  },
  "rest-cache": {
    config: {
      provider: {
        name: "memory",
        options: {
          max: 32767,
          maxAge: 3600,
        },
      },
      strategy: {
        contentTypes: [
          "api::achivement.achivement",
          "api::carousel.carousel",
          "api::challenge.challenge",
          "api::comic.comic",
          "api::course.course",
          "api::disconvery-jar-config.disconvery-jar-config",
          "api::discovery-jar-answer.discovery-jar-answer",
          "api::how-it-work.how-it-work",
          "api::live.live",
          "api::nac.nac",
          "api::notification.notification",
          "api::purchase.purchase",
          "api::tip-video.tip-video",
          "api::titbit.titbit",
          "api::top-up.top-up",
          "api::transaction.transaction",
          "api::video.video",
        ],
      },
    },
  },
});
