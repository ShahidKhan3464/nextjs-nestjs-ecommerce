import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Our Store',
      template: 'welcome',
      context: { name },
    });
  }

  public async sendResetPasswordEmail(
    email: string,
    name: string,
    resetUrl: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: 'reset-password',
      context: { name, resetUrl },
    });
  }
}
