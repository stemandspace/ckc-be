module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      connectionString: env("PGSTRING", "string"),
    },
    pool: {
      min: 2,
      max: 20, // Increased from default 2-10 to handle more concurrent connections
      acquireTimeoutMillis: 60000, // Increased timeout to 60 seconds
      idleTimeoutMillis: 30000, // Free idle connections after 30 seconds
      createTimeoutMillis: 30000, // Timeout for creating new connections
      destroyTimeoutMillis: 5000, // Timeout for destroying connections
      reapIntervalMillis: 1000, // Check for idle connections every second
      createRetryIntervalMillis: 200, // Retry interval for failed connection creation
    },
  },
});
