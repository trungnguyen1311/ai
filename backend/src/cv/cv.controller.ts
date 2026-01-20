import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  Get,
  Param,
  Res,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CvService } from './cv.service';
import type { Response } from 'express';
import { User } from '../users/user.entity';

@Controller('me/cv')
@UseGuards(AuthGuard('jwt'))
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadCV(
    @Request() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(pdf|msword|officedocument)/,
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024, // 10MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: any,
  ) {
    return this.cvService.uploadCV(req.user as User, file);
  }

  @Get()
  async getMyCVs(@Request() req) {
    return this.cvService.findAll(req.user.id);
  }

  @Get(':id/download')
  async downloadCV(
    @Request() req,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const filePath = await this.cvService.getFilePath(id, req.user.id);
    const cv = await this.cvService.findOne(id, req.user.id);

    // Set proper headers for download
    res.download(filePath, cv.fileName, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
    });
  }
}
