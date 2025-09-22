module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      connectionString: env("PGSTRING", "string"),
    },
  },
});
