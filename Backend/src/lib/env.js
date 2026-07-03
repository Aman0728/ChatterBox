import "dotenv/config";

export const ENV = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
}