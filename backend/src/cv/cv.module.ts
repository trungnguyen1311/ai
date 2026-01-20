import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CV } from './entities/cv.entity';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { AdminCvController } from './admin-cv.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CV])],
  controllers: [CvController, AdminCvController],
  providers: [CvService],
})
export class CvModule {}
