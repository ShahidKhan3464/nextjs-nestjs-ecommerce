import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  mailHost: process.env.MAIL_HOST,
  /** e.g. 2525 (Mailtrap), 587 (Gmail / most STARTTLS), 465 (implicit TLS) */
  mailPort: parseInt(process.env.MAIL_PORT ?? '2525', 10),
  mailSecure: process.env.MAIL_SECURE === 'true',
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
  apiVersion: process.env.API_VERSION || 'v1',
  environments: process.env.NODE_ENV || 'development',
  /** Base URL for password-reset links (no trailing slash), e.g. https://shop.example.com */
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
}));
