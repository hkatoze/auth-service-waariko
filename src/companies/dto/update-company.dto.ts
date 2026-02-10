import { IsOptional, IsString, IsEnum } from 'class-validator';
import { CompanyProfile } from '@prisma/client';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(CompanyProfile)
  profile: CompanyProfile;

  @IsOptional()
  @IsString()
  sector: string;

  @IsOptional()
  @IsString()
  invoiceTemplateId: string;

  @IsOptional()
  @IsString()
  primaryColor: string;

  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @IsOptional()
  @IsString()
  tertiaryColor?: string;

  @IsOptional()
  @IsString()
  headOffice?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phonePrimary?: string;

  @IsOptional()
  @IsString()
  phoneSecondary?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  rccm?: string;

  @IsOptional()
  @IsString()
  ifu?: string;

  @IsOptional()
  @IsString()
  ifu2?: string;

  @IsOptional()
  @IsString()
  legalStatus?: string;

  @IsOptional()
  @IsString()
  bankAccountNumber?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  signatureUrl?: string;
}
