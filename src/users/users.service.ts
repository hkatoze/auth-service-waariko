import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(email: string, fullname: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        fullname,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(userId: string, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async setResetOtp(userId: string, hashedOtp: string, expiresAt: Date) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        resetOtp: hashedOtp,
        resetOtpExpiresAt: expiresAt,
        resetOtpUsed: false,
      },
    });
  }

  async clearResetOtp(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        resetOtp: null,
        resetOtpExpiresAt: null,
        resetOtpUsed: true,
      },
    });
  }

  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }
}
