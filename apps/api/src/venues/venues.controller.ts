import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  findAll() {
    return this.venuesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  findMine(@CurrentUser() user: any) {
    return this.venuesService.findByManagerId(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venuesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateVenueDto, @CurrentUser() user: any) {
    return this.venuesService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVenueDto,
    @CurrentUser() user: any,
  ) {
    return this.venuesService.update(id, dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.venuesService.remove(id, user.id);
  }

  @Get(':id/availability')
  getAvailability(
    @Param('id') id: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.venuesService.getAvailability(id, year, month);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/availability')
  setAvailability(
    @Param('id') id: string,
    @Body() dto: SetAvailabilityDto,
    @CurrentUser() user: any,
  ) {
    return this.venuesService.setAvailability(id, dto.date, dto.status, dto.note);
  }
}
