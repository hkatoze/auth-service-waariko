import {
  Controller,
 
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('companies')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


}
