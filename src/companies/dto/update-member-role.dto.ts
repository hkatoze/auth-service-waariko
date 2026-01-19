import { IsEnum } from 'class-validator';
import { CompanyRole } from '@prisma/client';

export class UpdateMemberRoleDto {
  @IsEnum(CompanyRole)
  role: CompanyRole;
}
