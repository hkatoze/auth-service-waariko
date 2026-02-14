import {
  Controller,
  Get,
  Body,
  Req,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('companies/users/me')
  getMe(@Req() req) {
    const userId = req.user.sub;
    return this.usersService.findMe(userId);
  }

  @Patch('companies/users/me')
  updateMe(@Req() req, @Body() body: { fullname?: string; password?: string }) {
    const userId = req.user.sub;
    return this.usersService.updateMe(userId, body);
  }

  @Patch('companies/users/me/password')
  updatePassword(
    @Req() req,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    const userId = req.user.sub;

    return this.usersService.updatePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Delete('companies/users/me')
  deleteMe(@Req() req) {
    const userId = req.user.sub;
    return this.usersService.deleteMe(userId);
  }
}
