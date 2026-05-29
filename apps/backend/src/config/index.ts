import dotenv from "dotenv";
dotenv.config();

export const config = {
    jwtSecret:            process.env.JWT_SECRET            || "jwt_secret",
    jwtRefreshSecret:     process.env.JWT_REFRESH_SECRET    || "jwt_refresh_secret",
    stripeSecretKey:      process.env.STRIPE_SECRET_KEY     || "",
    stripeWebhookSecret:  process.env.STRIPE_WEBHOOK_SECRET || "",
    frontendUrl:          process.env.FRONTEND_URL          || "http://localhost:3000",
    stripeSuccessUrl:     process.env.STRIPE_SUCCESS_URL    || "",
    stripeCancelUrl:      process.env.STRIPE_CANCEL_URL     || "",
    gmailUser:            process.env.GMAIL_USER            || "",
    gmailAppPassword:     process.env.GMAIL_APP_PASSWORD    || "",
};
