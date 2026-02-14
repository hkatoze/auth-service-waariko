import { Controller, Post, Get, Body, Req, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateCompanyUserCodesDto } from './dto/update-company-user-codes.dto';


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

  @Get('myCompanies/:id')
  getCompany(@Param('id') companyId: string, @Req() req) {
    return this.companiesService.getCompanyForUser(companyId, req.user.sub);
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

  @Patch('myCompaniesUserCodes/:id')
  updateCompanyUser(
    @Param('id') companyId: string,
    @Body() dto: UpdateCompanyUserCodesDto,
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.companiesService.updateCompanyUser(companyId, userId, dto);
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

  //USER
  @Get('users/me')
  getMe(@Req() req) {
    const userId = req.user.sub;
    return this.companiesService.findMe(userId);
  }

  @Patch('users/me')
  updateMe(@Req() req, @Body() body: { fullname?: string; password?: string }) {
    const userId = req.user.sub;
    return this.companiesService.updateMe(userId, body);
  }

  @Patch('users/me/password')
  updatePassword(
    @Req() req,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    const userId = req.user.sub;

    return this.companiesService.updatePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Delete('users/me')
  deleteMe(@Req() req) {
    const userId = req.user.sub;
    return this.companiesService.deleteMe(userId);
  }
}
