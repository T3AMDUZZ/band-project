import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PerformancesService } from './performances.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { AssignBandDto } from './dto/assign-band.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('performances')
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.performancesService.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.performancesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreatePerformanceDto, @CurrentUser() user: any) {
    return this.performancesService.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdatePerformanceDto) {
    return this.performancesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.performancesService.remove(id);
  }

  @Post(':id/bands')
  @UseGuards(JwtAuthGuard)
  assignBand(@Param('id') id: string, @Body() dto: AssignBandDto) {
    return this.performancesService.assignBand(id, dto.bandId, dto.playOrder, dto.setlist);
  }

  @Delete(':id/bands/:bandId')
  @UseGuards(JwtAuthGuard)
  removeBand(@Param('id') id: string, @Param('bandId') bandId: string) {
    return this.performancesService.removeBand(id, bandId);
  }
}
