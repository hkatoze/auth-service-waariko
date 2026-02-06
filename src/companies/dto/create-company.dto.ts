import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CompanyProfile } from '@prisma/client';

 


export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsEnum(CompanyProfile)
  profile: CompanyProfile;

  @IsString()
  sector: string;

  @IsString()
  invoiceTemplateId: string;

  @IsString()
  primaryColor: string;

  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @IsOptional()
  @IsString()
  tertiaryColor?: string;

  @IsString()
  headOffice: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  phonePrimary: string;

  @IsOptional()
  @IsString()
  phoneSecondary?: string;

  @IsOptional()
  @IsString()
  rccm?: string;

  @IsOptional()
  @IsString()
  ifu?: string;

  @IsString()
  legalStatus: string;

  @IsOptional()
  @IsString()
  bankAccountNumber?: string;

  @IsString()
  logoUrl: string;

  @IsOptional()
  @IsString()
  signatureUrl?: string;
}
