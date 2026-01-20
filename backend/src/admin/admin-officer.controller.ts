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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { AdminOfficerService } from './admin-officer.service';
import { OfficerQueryDto } from './dto/officer-query.dto';
import { CreateOfficerDto } from './dto/create-officer.dto';

@Controller('admin/officers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminOfficerController {
  constructor(private readonly adminOfficerService: AdminOfficerService) {}

  @Post()
  async create(@Body() dto: CreateOfficerDto) {
    return this.adminOfficerService.create(dto);
  }

  @Get()
  async findAll(@Query() query: OfficerQueryDto) {
    return this.adminOfficerService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminOfficerService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('isActive', ParseBoolPipe) isActive: boolean,
  ) {
    return this.adminOfficerService.updateStatus(id, isActive);
  }
}
