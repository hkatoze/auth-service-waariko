import { IsEnum, IsOptional, IsString, IsEmail } from 'class-validator';

export enum CompanyProfile {
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  TRADER = 'TRADER',
}

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

  @IsOptional()
  @IsString()
  headOffice?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phonePrimary?: string;

  @IsOptional()
  @IsString()
  phoneSecondary?: string;

  @IsOptional()
  @IsString()
  rccm?: string;

  @IsOptional()
  @IsString()
  ifu?: string;

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
