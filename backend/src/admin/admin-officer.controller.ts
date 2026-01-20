import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseBoolPipe,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { AdminOfficerService } from './admin-officer.service';
import { OfficerQueryDto } from './dto/officer-query.dto';
import { CreateOfficerDto } from './dto/create-officer.dto';
import { UpdateOfficerDto } from './dto/update-officer.dto';

@Controller('admin/officers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminOfficerController {
  constructor(private readonly adminOfficerService: AdminOfficerService) {}

  @Post()
  async create(@Body() dto: CreateOfficerDto) {
    return this.adminOfficerService.create(dto);
  }

  @Post('seed')
  async seed() {
    return this.adminOfficerService.seedData();
  }

  @Get()
  async findAll(@Query() query: OfficerQueryDto) {
    return this.adminOfficerService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminOfficerService.findOne(id);
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.adminOfficerService.getHistory(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('isActive', ParseBoolPipe) isActive: boolean,
  ) {
    return this.adminOfficerService.updateStatus(id, isActive);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOfficerDto) {
    return this.adminOfficerService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.adminOfficerService.remove(id);
  }
}
