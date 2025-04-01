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
        preResponseTransform: (ctx) => { },
        postResponseTransform: (ctx) => { },
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
  // AWS - S3 Bucket Configuration
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
  // AWS - Simple Email Service Configuration
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

  redis: {
    config: {
      settings: {
        enableRedlock: true,
        lockDelay: null,
        lockTTL: 5000,
        redlockConfig: {
          driftFactor: 0.01,
          retryCount: 10,
          retryDelay: 200,
          retryJitter: 200,
        },
      },
      connections: {
        default: {
          connection: {
            host: process.env.REDIS_HOST || "127.0.0.1",
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD,
            db: 0,
          },
          settings: {
            debug: false,
          },
        },
      },
    },
  },
  "rest-cache": {
    config: {
      // provider: {
      //   name: "memory",
      //   options: {
      //     max: 32767,
      //     maxAge: 3600,
      //   },
      // },
      provider: {
        name: "redis",
        options: {
          host: process.env.REDIS_HOST || "127.0.0.1",
          port: process.env.REDIS_PORT || 6379,
          password: process.env.REDIS_PASSWORD,
        },
      },
      strategy: {
        debug: true,
        contentTypes: [
          // { contentType: "api::achivement.achivement", maxAge: 60 * 60 * 1000 },
          { contentType: "api::carousel.carousel", maxAge: 60 * 60 * 1000 },
          { contentType: "api::challenge.challenge", maxAge: 60 * 60 * 1000 },
          { contentType: "api::comic.comic", maxAge: 60 * 60 * 1000 },
          { contentType: "api::course.course", maxAge: 60 * 60 * 1000 },
          {
            contentType: "api::disconvery-jar-config.disconvery-jar-config",
            maxAge: 60 * 60 * 1000,
          },
          {
            contentType: "api::discovery-jar-answer.discovery-jar-answer",
            maxAge: 60 * 60 * 1000,
          },
          // {
          //   contentType: "api::how-it-work.how-it-work",
          //   maxAge: 60 * 60 * 1000,
          // },
          { contentType: "api::live.live", maxAge: 60 * 60 * 1000 },
          { contentType: "api::nac.nac", maxAge: 60 * 60 * 1000 },
          { contentType: "api::purchase.purchase", maxAge: 60 * 60 * 1000 },
          { contentType: "api::tip-video.tip-video", maxAge: 60 * 60 * 1000 },
          { contentType: "api::titbit.titbit", maxAge: 60 * 60 * 1000 },
          { contentType: "api::top-up.top-up", maxAge: 60 * 60 * 1000 },
          // {
          //   contentType: "api::transaction.transaction",
          //   maxAge: 60 * 60 * 1000,
          // },
          { contentType: "api::video.video", maxAge: 60 * 60 * 1000 },
          { contentType: "api::plan.plan", maxAge: 7 * 24 * 60 * 60 * 1000 },
          { contentType: "api::stack.stack", maxAge: 60 * 60 * 1000 },
          { contentType: "api::daily-quiz.daily-quiz", maxAge: 60 * 60 * 1000 },
          {
            contentType: "api::daily-spin.daily-spin",
            maxAge: 12 * 60 * 60 * 1000,
          },
          {
            contentType: "api::just-launched-config.just-launched-config",
            maxAge: 24 * 60 * 60 * 1000,
          },
          {
            contentType: "api::referral-config.referral-config",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          },
        ],
      },
    },
  },
});
