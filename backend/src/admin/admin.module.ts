import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { OfficerProfile } from '../profile/entities/officer-profile.entity';
import { AdminOfficerController } from './admin-officer.controller';
import { AdminOfficerService } from './admin-officer.service';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';

import { AuthModule } from '../auth/auth.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OfficerProfile]),
    AuthModule,
    ProfileModule,
  ],
  controllers: [AdminOfficerController, AdminDashboardController],
  providers: [AdminOfficerService, AdminDashboardService],
})
export class AdminModule {}
