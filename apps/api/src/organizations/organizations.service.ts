import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(type?: string) {
    return this.prisma.organization.findMany({
      where: type ? { type: type as any } : undefined,
      include: {
        _count: {
          select: {
            bands: true,
            members: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        bands: true,
        members: {
          include: { user: true },
        },
        announcements: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('단체를 찾을 수 없습니다.');
    }

    return organization;
  }

  async create(dto: CreateOrganizationDto, userId: string) {
    return this.prisma.organization.create({
      data: {
        name: dto.name,
        type: dto.type as any,
        description: dto.description,
        profileImage: dto.profileImage,
        coverImage: dto.coverImage,
        school: dto.school,
        region: dto.region,
        snsLinks: dto.snsLinks,
        members: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        members: { include: { user: true } },
      },
    });
  }

  async update(id: string, dto: UpdateOrganizationDto, userId: string) {
    const isAdminUser = await this.isAdmin(id, userId);
    if (!isAdminUser) {
      throw new ForbiddenException('관리자만 단체 정보를 수정할 수 있습니다.');
    }

    return this.prisma.organization.update({
      where: { id },
      data: {
        name: dto.name,
        type: dto.type as any,
        description: dto.description,
        profileImage: dto.profileImage,
        coverImage: dto.coverImage,
        school: dto.school,
        region: dto.region,
        snsLinks: dto.snsLinks,
      },
      include: {
        members: { include: { user: true } },
      },
    });
  }

  async remove(id: string, userId: string) {
    const isAdminUser = await this.isAdmin(id, userId);
    if (!isAdminUser) {
      throw new ForbiddenException('관리자만 단체를 삭제할 수 있습니다.');
    }

    // Delete related records first
    await this.prisma.announcement.deleteMany({
      where: { organizationId: id },
    });
    await this.prisma.organizationMember.deleteMany({
      where: { organizationId: id },
    });

    return this.prisma.organization.delete({ where: { id } });
  }

  async addMember(orgId: string, userId: string, role?: string) {
    await this.findOne(orgId);

    return this.prisma.organizationMember.create({
      data: {
        organizationId: orgId,
        userId,
        role: (role as any) || 'MEMBER',
      },
      include: { user: true },
    });
  }

  async removeMember(orgId: string, targetUserId: string, userId: string) {
    const isAdminUser = await this.isAdmin(orgId, userId);
    if (!isAdminUser) {
      throw new ForbiddenException('관리자만 멤버를 제거할 수 있습니다.');
    }

    return this.prisma.organizationMember.delete({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId: targetUserId,
        },
      },
    });
  }

  async createAnnouncement(
    orgId: string,
    authorId: string,
    title: string,
    content: string,
    isPinned?: boolean,
  ) {
    const isAdminUser = await this.isAdmin(orgId, authorId);
    if (!isAdminUser) {
      throw new ForbiddenException('관리자만 공지를 작성할 수 있습니다.');
    }

    return this.prisma.announcement.create({
      data: {
        organizationId: orgId,
        authorId,
        title,
        content,
        isPinned: isPinned ?? false,
      },
    });
  }

  async getAnnouncements(orgId: string) {
    await this.findOne(orgId);

    return this.prisma.announcement.findMany({
      where: { organizationId: orgId },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async isAdmin(orgId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId,
        },
      },
    });

    return member?.role === 'ADMIN';
  }
}
