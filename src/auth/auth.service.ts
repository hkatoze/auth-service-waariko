import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(email: string, fullname: string, password: string) {
    return this.usersService.create(email, fullname, password);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Compte non enregistré');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      email: user.email,
      userId: user.id,
      fullname: user.fullname,
      activeCompanyId: user.activeCompanyId,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    // Toujours répondre OK (sécurité)
    if (!user) {
      return { message: 'Si le compte existe, un code a été envoyé.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    await this.usersService.update(user.id, {
      resetOtp: hashedOtp,
      resetOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
      resetOtpUsed: false,
    });

    await this.mailService.sendOtpEmail(email,user.fullname, otp);

    


    return { message: 'Si le compte existe, un code a été envoyé.' };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.resetOtp) {
      throw new UnauthorizedException('Code invalide');
    }

    if (user.resetOtpUsed) {
      throw new UnauthorizedException('Code déjà utilisé');
    }

    if (new Date() > user.resetOtpExpiresAt!) {
      throw new UnauthorizedException('Code expiré');
    }

    const isValid = await bcrypt.compare(otp, user.resetOtp);

    if (!isValid) {
      throw new UnauthorizedException('Code invalide');
    }

    return { message: 'Code valide' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.resetOtp) {
      throw new UnauthorizedException('Action invalide');
    }

    const isValid = await bcrypt.compare(otp, user.resetOtp);

    if (!isValid) {
      throw new UnauthorizedException('Code invalide');
    }

    if (user.resetOtpUsed) {
      throw new UnauthorizedException('Code déjà utilisé');
    }

    if (new Date() > user.resetOtpExpiresAt!) {
      throw new UnauthorizedException('Code expiré');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.update(user.id, {
      password: hashedPassword,
      resetOtp: null,
      resetOtpExpiresAt: null,
      resetOtpUsed: true,
    });

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
