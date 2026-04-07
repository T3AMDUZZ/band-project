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
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  findAll(@Query('type') type?: string) {
    return this.organizationsService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateOrganizationDto, @CurrentUser() user: any) {
    return this.organizationsService.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
    @CurrentUser() user: any,
  ) {
    return this.organizationsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.organizationsService.remove(id, user.id);
  }

  @Post(':id/members')
  @UseGuards(JwtAuthGuard)
  addMember(
    @Param('id') id: string,
    @Body() body: { userId: string; role?: string },
  ) {
    return this.organizationsService.addMember(id, body.userId, body.role);
  }

  @Delete(':id/members/:userId')
  @UseGuards(JwtAuthGuard)
  removeMember(
    @Param('id') id: string,
    @Param('userId') targetUserId: string,
    @CurrentUser() user: any,
  ) {
    return this.organizationsService.removeMember(id, targetUserId, user.id);
  }

  @Get(':id/announcements')
  getAnnouncements(@Param('id') id: string) {
    return this.organizationsService.getAnnouncements(id);
  }

  @Post(':id/announcements')
  @UseGuards(JwtAuthGuard)
  createAnnouncement(
    @Param('id') id: string,
    @Body() dto: CreateAnnouncementDto,
    @CurrentUser() user: any,
  ) {
    return this.organizationsService.createAnnouncement(
      id,
      user.id,
      dto.title,
      dto.content,
      dto.isPinned,
    );
  }
}
