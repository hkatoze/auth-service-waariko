import { Controller, Post, Get, Body, Req, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { AddMemberDto } from './dto/add-member.dto';

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

  @Get('myCompanies/:id/members')
  listMembers(@Param('id') companyId: string, @Req() req) {
    return this.companiesService.listMembers(companyId, req.user.sub);
  }

  @Post('myCompanies/:id/members')
  addMember(
    @Param('id') companyId: string,
    @Body() dto: AddMemberDto,
    @Req() req,
  ) {
    return this.companiesService.addMember(companyId, req.user.sub, dto);
  }

  @Patch('myCompanies/:id/members/:userId')
  updateMemberRole(
    @Param('id') companyId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateMemberRoleDto,
    @Req() req,
  ) {
    return this.companiesService.updateMemberRole(
      companyId,
      req.user.sub,
      userId,
      dto.role,
    );
  }

  @Delete('myCompanies/:id/members/:userId')
  removeMember(
    @Param('id') companyId: string,
    @Param('userId') userId: string,
    @Req() req,
  ) {
    return this.companiesService.removeMember(companyId, req.user.sub, userId);
  }
}
