import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityStatus } from '@prisma/client';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Injectable()
export class VenuesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.venue.findMany({
      include: {
        _count: { select: { reservations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
      include: {
        availability: true,
        reservations: {
          include: {
            band: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    return venue;
  }

  async create(dto: CreateVenueDto, managerId: string) {
    return this.prisma.venue.create({
      data: {
        name: dto.name,
        address: dto.address,
        capacity: dto.capacity,
        operatingHours: dto.operatingHours,
        rentalFee: dto.rentalFee,
        description: dto.description,
        photos: dto.photos ?? [],
        managerId,
      },
    });
  }

  async update(id: string, dto: UpdateVenueDto, userId: string) {
    const venue = await this.prisma.venue.findUnique({ where: { id } });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    if (venue.managerId !== userId) {
      throw new ForbiddenException('Only the venue manager can update this venue');
    }

    return this.prisma.venue.update({
      where: { id },
      data: {
        name: dto.name,
        address: dto.address,
        capacity: dto.capacity,
        operatingHours: dto.operatingHours,
        rentalFee: dto.rentalFee,
        description: dto.description,
        photos: dto.photos,
      },
    });
  }

  async remove(id: string, userId: string) {
    const venue = await this.prisma.venue.findUnique({ where: { id } });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    if (venue.managerId !== userId) {
      throw new ForbiddenException('Only the venue manager can delete this venue');
    }

    return this.prisma.venue.delete({ where: { id } });
  }

  async setAvailability(
    venueId: string,
    date: string,
    status: AvailabilityStatus,
  ) {
    const venue = await this.prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    const dateObj = new Date(date);

    return this.prisma.venueAvailability.upsert({
      where: { venueId_date: { venueId, date: dateObj } },
      update: { status },
      create: { venueId, date: dateObj, status },
    });
  }

  async getAvailability(venueId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return this.prisma.venueAvailability.findMany({
      where: {
        venueId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async findByManagerId(userId: string) {
    return this.prisma.venue.findMany({
      where: { managerId: userId },
      include: {
        _count: { select: { reservations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
