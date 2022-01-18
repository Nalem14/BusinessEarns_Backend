
export default () => ({
  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    pass: process.env.DB_PASS || "root",
    name: process.env.DB_NAME || "business",
  }
});
