import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class BandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { genre: { hasSome: [search] } },
          ],
        }
      : undefined;

    return this.prisma.band.findMany({
      where,
      include: {
        organization: { select: { name: true } },
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const band = await this.prisma.band.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, nickname: true, email: true },
            },
          },
        },
        performances: true,
        organization: true,
      },
    });

    if (!band) {
      throw new NotFoundException('Band not found');
    }

    return band;
  }

  async create(dto: CreateBandDto, userId: string) {
    const inviteCode = this.generateInviteCode();

    return this.prisma.band.create({
      data: {
        name: dto.name,
        genre: dto.genre,
        description: dto.description,
        profileImage: dto.profileImage,
        coverImage: dto.coverImage,
        snsLinks: dto.snsLinks,
        status: dto.status as any,
        inviteCode,
        organizationId: dto.organizationId,
        members: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, nickname: true, email: true },
            },
          },
        },
      },
    });
  }

  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      if (i === 4) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async joinByInviteCode(inviteCode: string, userId: string) {
    const band = await this.prisma.band.findUnique({
      where: { inviteCode },
    });

    if (!band) {
      throw new NotFoundException('유효하지 않은 초대코드입니다.');
    }

    const existing = await this.prisma.bandMember.findUnique({
      where: { bandId_userId: { bandId: band.id, userId } },
    });

    if (existing) {
      return { message: '이미 멤버입니다.', band };
    }

    await this.prisma.bandMember.create({
      data: {
        bandId: band.id,
        userId,
        role: 'MEMBER',
      },
    });

    return this.findOne(band.id);
  }

  async update(id: string, dto: UpdateBandDto, userId: string) {
    if (!(await this.isAdmin(id, userId))) {
      throw new ForbiddenException('Only band admins can update band info');
    }

    return this.prisma.band.update({
      where: { id },
      data: {
        name: dto.name,
        genre: dto.genre,
        description: dto.description,
        profileImage: dto.profileImage,
        coverImage: dto.coverImage,
        snsLinks: dto.snsLinks,
        status: dto.status as any,
        organizationId: dto.organizationId,
      },
    });
  }

  async remove(id: string, userId: string) {
    if (!(await this.isAdmin(id, userId))) {
      throw new ForbiddenException('Only band admins can delete a band');
    }

    return this.prisma.band.delete({ where: { id } });
  }

  async addMember(bandId: string, dto: AddMemberDto, userId: string) {
    if (!(await this.isAdmin(bandId, userId))) {
      throw new ForbiddenException('Only band admins can add members');
    }

    return this.prisma.bandMember.create({
      data: {
        bandId,
        userId: dto.userId,
        role: dto.role,
        part: dto.part,
      },
      include: {
        user: {
          select: { id: true, name: true, nickname: true, email: true },
        },
      },
    });
  }

  async removeMember(bandId: string, targetUserId: string, userId: string) {
    if (!(await this.isAdmin(bandId, userId))) {
      throw new ForbiddenException('Only band admins can remove members');
    }

    const member = await this.prisma.bandMember.findUnique({
      where: { bandId_userId: { bandId, userId: targetUserId } },
    });

    if (!member) {
      throw new NotFoundException('Member not found in this band');
    }

    return this.prisma.bandMember.delete({
      where: { bandId_userId: { bandId, userId: targetUserId } },
    });
  }

  async isAdmin(bandId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.bandMember.findUnique({
      where: { bandId_userId: { bandId, userId } },
    });

    return member?.role === 'ADMIN';
  }

  async findByUserId(userId: string) {
    return this.prisma.band.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        organization: { select: { name: true } },
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
