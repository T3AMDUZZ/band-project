import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';

@Injectable()
export class PerformancesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: string) {
    return this.prisma.performance.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        venue: true,
        bands: {
          include: { band: true },
          orderBy: { playOrder: 'asc' },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string) {
    const performance = await this.prisma.performance.findUnique({
      where: { id },
      include: {
        venue: true,
        bands: {
          include: {
            band: {
              include: { members: { include: { user: true } } },
            },
          },
          orderBy: { playOrder: 'asc' },
        },
      },
    });

    if (!performance) {
      throw new NotFoundException('공연을 찾을 수 없습니다.');
    }

    return performance;
  }

  async create(dto: CreatePerformanceDto, userId: string) {
    return this.prisma.performance.create({
      data: {
        title: dto.title,
        description: dto.description,
        date: new Date(dto.date),
        startTime: dto.startTime,
        endTime: dto.endTime,
        venueId: dto.venueId,
        ticketPrice: dto.ticketPrice,
        posterImage: dto.posterImage,
        status: dto.status as any,
        createdBy: userId,
      },
      include: {
        venue: true,
        bands: { include: { band: true } },
      },
    });
  }

  async update(id: string, dto: UpdatePerformanceDto) {
    await this.findOne(id);

    const data: any = { ...dto };
    if (dto.date) {
      data.date = new Date(dto.date);
    }

    return this.prisma.performance.update({
      where: { id },
      data,
      include: {
        venue: true,
        bands: { include: { band: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Delete related PerformanceBand records first
    await this.prisma.performanceBand.deleteMany({
      where: { performanceId: id },
    });

    return this.prisma.performance.delete({ where: { id } });
  }

  async assignBand(performanceId: string, bandId: string, playOrder?: number, setlist?: any) {
    await this.findOne(performanceId);

    return this.prisma.performanceBand.create({
      data: {
        performanceId,
        bandId,
        playOrder: playOrder ?? 0,
        setlist,
      },
      include: {
        band: true,
        performance: true,
      },
    });
  }

  async removeBand(performanceId: string, bandId: string) {
    await this.findOne(performanceId);

    return this.prisma.performanceBand.delete({
      where: {
        performanceId_bandId: { performanceId, bandId },
      },
    });
  }
}
