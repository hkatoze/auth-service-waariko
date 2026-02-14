import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { CompanyRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateCompanyUserCodesDto } from './dto/update-company-user-codes.dto';
 

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCompanyDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: dto.name,
          profile: dto.profile,
          sector: dto.sector,
          invoiceTemplateId: dto.invoiceTemplateId,
          primaryColor: dto.primaryColor,
          secondaryColor: dto.secondaryColor,
          tertiaryColor: dto.tertiaryColor,
          headOffice: dto.headOffice,
          email: dto.email,
          phonePrimary: dto.phonePrimary,
          phoneSecondary: dto.phoneSecondary,
          rccm: dto.rccm,
          website: dto.website,
          ifu: dto.ifu,
          ifu2: dto.ifu2,
          legalStatus: dto.legalStatus,
          bankAccountNumber: dto.bankAccountNumber,
          logoUrl: dto.logoUrl,
          signatureUrl: dto.signatureUrl,
        },
      });

      await tx.companyUser.create({
        data: {
          userId,
          companyId: company.id,
          role: 'OWNER',
        },
      });

      return company;
    });
  }

  async existsForUser(userId: string) {
    const count = await this.prisma.companyUser.count({
      where: { userId },
    });
    return { hasCompany: count > 0 };
  }
  async setActiveCompany(userId: string, companyId: string) {
    // 1️⃣ Vérifier que l’utilisateur appartient à cette entreprise
    const membership = await this.prisma.companyUser.findFirst({
      where: {
        userId,
        companyId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not belong to this company');
    }

    // 2️⃣ Mettre à jour l’entreprise active
    await this.prisma.user.update({
      where: { id: userId },
      data: { activeCompanyId: companyId },
    });

    return { success: true, companyId };
  }

  async getActiveCompany(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        companies: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!user?.activeCompanyId) {
      return null;
    }

    const active = user.companies.find(
      (cu) => cu.companyId === user.activeCompanyId,
    );

    return active ? { ...active.company, role: active.role } : null;
  }

  async getCompanyForUser(companyId: string, userId: string) {
    const membership = await this.prisma.companyUser.findFirst({
      where: {
        companyId,
        userId,
      },
      include: {
        company: true,
        user: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not belong to this company');
    }

    return {
      ...membership.company,
      user: { ...membership.user },
      role: membership.role,
    };
  }

  async updateCompany(
    companyId: string,
    userId: string,
    dto: UpdateCompanyDto,
  ) {
    // 1️⃣ Vérifier l’appartenance + rôle
    const membership = await this.prisma.companyUser.findFirst({
      where: {
        userId,
        companyId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not belong to this company');
    }

    if (!['OWNER', 'ADMIN'].includes(membership.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // 2️⃣ Vérifier que l’entreprise existe
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // 3️⃣ Mise à jour
    return this.prisma.company.update({
      where: { id: companyId },
      data: dto,
    });
  }

  async updateCompanyUserCodes(
    companyId: string,
    userId: string,
    dto: UpdateCompanyUserCodesDto,
  ) {
    // 1️⃣ Vérifier l’appartenance + rôle
    const membership = await this.prisma.companyUser.findFirst({
      where: {
        userId,
        companyId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not belong to this company');
    }

    if (!['OWNER', 'ADMIN'].includes(membership.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // 2️⃣ Vérifier que l’entreprise existe
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // 3️⃣ Mise à jour
    return this.prisma.companyUser.update({
      where: { id: membership.id },
      data: dto,
    });
  }
  private async requireAdminOrOwner(userId: string, companyId: string) {
    const membership = await this.prisma.companyUser.findFirst({
      where: { userId, companyId },
    });

    if (!membership) {
      throw new ForbiddenException('Not a company member');
    }

    if (!['OWNER', 'ADMIN'].includes(membership.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return membership;
  }
  async listMembers(companyId: string, userId: string) {
    await this.requireAdminOrOwner(userId, companyId);

    return this.prisma.companyUser.findMany({
      where: { companyId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullname: true,
          },
        },
      },
    });
  }
  async addMember(companyId: string, userId: string, dto: AddMemberDto) {
    await this.requireAdminOrOwner(userId, companyId);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.companyUser.create({
      data: {
        companyId,
        userId: user.id,
        role: dto.role,
      },
    });
  }
  async updateMemberRole(
    companyId: string,
    requesterId: string,
    targetUserId: string,
    role: CompanyRole,
  ) {
    const requester = await this.requireAdminOrOwner(requesterId, companyId);

    if (requester.role === 'ADMIN' && role === 'OWNER') {
      throw new ForbiddenException('ADMIN cannot assign OWNER');
    }

    return this.prisma.companyUser.update({
      where: {
        userId_companyId: {
          userId: targetUserId,
          companyId,
        },
      },
      data: { role },
    });
  }
  async removeMember(
    companyId: string,
    requesterId: string,
    targetUserId: string,
  ) {
    const requester = await this.requireAdminOrOwner(requesterId, companyId);

    if (requester.userId === targetUserId) {
      throw new ForbiddenException('Cannot remove yourself');
    }

    return this.prisma.companyUser.delete({
      where: {
        userId_companyId: {
          userId: targetUserId,
          companyId,
        },
      },
    });
  }

  async findForUser(userId: string) {
    const companies = await this.prisma.companyUser.findMany({
      where: {
        userId,
      },
      include: {
        company: true, // 🔥 toutes les propriétés de Company
      },
    });

    return companies.map((cu) => ({
      ...cu.company, // ✅ toutes les colonnes de Company
      role: cu.role, // ✅ rôle de l’utilisateur
    }));
  }

  // Méthodes supplémentaires pour la gestion de l'utilisateur conecté à une entreprise

  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullname: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateMe(userId: string, data: { fullname?: string; email?: string }) {
    const updateData: any = {};

    if (data.fullname) {
      updateData.fullname = data.fullname;
    }

    if (data.email) {
      updateData.email = data.email;
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullname: true,
      },
    });

    return user;
  }
  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw new ForbiddenException('Incorrect current password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async deleteMe(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully' };
  }
}
