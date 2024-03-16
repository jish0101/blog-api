export default {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI,
  ACCESSTOKENSEC: process.env.ACCESS_TOKEN_SEC,
  REFRESH_TOKEN_SEC: process.env.REFRESH_TOKEN_SEC,
  SMTP_USERNAME: process.env.SMTP_USERNAME,
  SMTP_FROM: process.env.SMTP_FROM,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  OTP_RESEND_DELAY: process.env.OTP_RESEND_DELAY || 2,
};
