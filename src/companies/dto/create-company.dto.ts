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


  @IsString()
  headOffice?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

   
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


  @IsString()
  legalStatus?: string;

  @IsOptional()
  @IsString()
  bankAccountNumber?: string;

 
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  signatureUrl?: string;
}
