import { Controller, Post, Get, Body, Req, UseGuards, Patch, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('createMyCompany')
  async create(@Body() dto: CreateCompanyDto, @Req() req) {
    const userId = req.user.sub;
    return this.companiesService.create(dto, userId);
  }
  @Get('myCompanies')
  findMyCompanies(@Req() req) {
    const userId = req.user.sub;
    return this.companiesService.findForUser(userId);
  }
  @Post('active')
  setActiveCompany(@Body('companyId') companyId: string, @Req() req) {
    const userId = req.user.sub;
    return this.companiesService.setActiveCompany(userId, companyId);
  }

  @Get('active')
  getActiveCompany(@Req() req) {
    const userId = req.user.sub;
    return this.companiesService.getActiveCompany(userId);
  }
  @Patch('myCompanies/:id')
  updateCompany(
    @Param('id') companyId: string,
    @Body() dto: UpdateCompanyDto,
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.companiesService.updateCompany(companyId, userId, dto);
  }
  @Get('exists')
  exists(@Req() req) {
    const userId = req.user.sub;
    return this.companiesService.existsForUser(userId);
  }
}
