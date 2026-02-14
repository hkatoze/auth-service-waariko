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
@Controller('companies')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users/me')
  getMe(@Req() req) {
    const userId = req.user.sub;
    return this.usersService.findMe(userId);
  }

  @Patch('users/me')
  updateMe(@Req() req, @Body() body: { fullname?: string; password?: string }) {
    const userId = req.user.sub;
    return this.usersService.updateMe(userId, body);
  }

  @Patch('users/me/password')
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

  @Delete('users/me')
  deleteMe(@Req() req) {
    const userId = req.user.sub;
    return this.usersService.deleteMe(userId);
  }
}
