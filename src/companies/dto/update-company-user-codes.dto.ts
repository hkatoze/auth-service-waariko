import { IsOptional, IsString, IsEnum } from 'class-validator';
 

export class UpdateCompanyUserCodesDto {
  @IsOptional()
  @IsString()
  finance_code_access: string;

  @IsOptional()
  @IsString()
  expenses_code_access: string;

  @IsOptional()
  @IsString()
  stock_code_access: string;
}
