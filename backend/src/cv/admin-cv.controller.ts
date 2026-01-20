import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { CvService } from './cv.service';
import type { Response } from 'express';

@Controller('admin/cv')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN, UserRole.UNIT_ADMIN)
export class AdminCvController {
  constructor(private readonly cvService: CvService) {}

  @Get('user/:userId')
  async getOfficerCVs(@Param('userId') userId: string) {
    return this.cvService.findAll(userId);
  }

  @Get(':id/download')
  async downloadCV(@Param('id') id: string, @Res() res: Response) {
    const filePath = await this.cvService.getFilePathById(id);
    const cv = await this.cvService.findById(id);

    res.download(filePath, cv.fileName, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
    });
  }
}
