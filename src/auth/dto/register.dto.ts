import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  fullname: string;

  @IsString()
  @MinLength(8)
  password: string;
}
