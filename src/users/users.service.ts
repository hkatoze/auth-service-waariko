 
 import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
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
      throw new ConflictException('Email already in use ');
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
    return  this.prisma.user.findUnique({ where: { email } });
  }
}


 




  
 
