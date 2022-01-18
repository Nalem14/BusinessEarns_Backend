
export default () => ({
    app: {
        environment: process.env.APP_ENV || "development",
        url: process.env.APP_URL || "http://localhost",
        port: parseInt(process.env.APP_PORT, 10) || 3000,
        secret: process.env.APP_KEY || "",
    }
});
