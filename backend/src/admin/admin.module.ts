import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { OfficerProfile } from '../profile/entities/officer-profile.entity';
import { AdminOfficerController } from './admin-officer.controller';
import { AdminOfficerService } from './admin-officer.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, OfficerProfile])],
  controllers: [AdminOfficerController],
  providers: [AdminOfficerService],
})
export class AdminModule {}
