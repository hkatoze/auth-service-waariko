import { IsEmail, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @Length(6, 6)
  otp: string;

  @Length(6, 50)
  newPassword: string;
}
