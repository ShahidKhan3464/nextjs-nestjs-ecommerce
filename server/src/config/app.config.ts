import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  mailHost: process.env.MAIL_HOST,
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
  apiVersion: process.env.API_VERSION || 'v1',
  environments: process.env.NODE_ENV || 'development',
}));
