import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { resetPasswordTemplate } from './templates/reset-password.template';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false, // true si port 465
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Mail error:', error);
      throw new InternalServerErrorException('Erreur lors de l’envoi du mail');
    }
  }

  async sendOtpEmail(to: string, fullname: string, otp: string) {
    const html = resetPasswordTemplate(fullname, otp);

    await this.sendMail(to, 'Réinitialisation de votre mot de passe', html);
  }
}
