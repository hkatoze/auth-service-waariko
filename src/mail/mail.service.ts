
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sgMail from '@sendgrid/mail';       
import { resetPasswordTemplate } from './templates/reset-password.template';

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await sgMail.send({
        to,
        from: process.env.MAIL_USER as string,
        subject,
        html,
      });
    } catch (error) {
      console.error('SendGrid error:', error.response?.body || error);
      throw new InternalServerErrorException('Erreur lors de l’envoi du mail');
    }
  }

  async sendOtpEmail(to: string, fullname: string, otp: string) {
    const html = resetPasswordTemplate(fullname, otp);

    await this.sendMail(to, 'Réinitialisation de votre mot de passe', html);
  }
}
