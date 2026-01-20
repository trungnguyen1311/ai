import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OfficerProfile,
  Department,
} from '../profile/entities/officer-profile.entity';
import { User } from '../users/user.entity';

interface RawCountResult {
  type: string;
  count: string;
}

interface RawTrendResult {
  label: string;
  count: string;
}

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(OfficerProfile)
    private readonly officerRepository: Repository<OfficerProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getDashboardStats() {
    const officerStats = await this.getOfficerStats();
    const timeStats = await this.getTimeStats();
    const fundStats = this.getMockFundStats();

    return {
      officerStats,
      timeStats,
      fundStats,
    };
  }

  private async getOfficerStats() {
    const total = await this.officerRepository.count();

    // Split by status (based on User entity)
    const active = await this.userRepository.count({
      where: { isActive: true },
    });
    const inactive = await this.userRepository.count({
      where: { isActive: false },
    });

    // Stats by Department
    const byDepartmentRaw = await this.officerRepository
      .createQueryBuilder('officer')
      .select('officer.department', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('officer.department')
      .getRawMany<RawCountResult>();

    // Stats by Union Position
    const byPositionRaw = await this.officerRepository
      .createQueryBuilder('officer')
      .select('officer.union_position', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('officer.union_position')
      .getRawMany<RawCountResult>();

    return {
      total,
      byStatus: { active, inactive },
      byDepartment: byDepartmentRaw.map((d) => ({
        type: d.type,
        count: parseInt(d.count, 10),
      })),
      byPosition: byPositionRaw.map((p) => ({
        type: p.type,
        count: parseInt(p.count, 10),
      })),
    };
  }

  private async getTimeStats() {
    // Get join trend for last 12 months
    const trendRaw = await this.officerRepository
      .createQueryBuilder('officer')
      .select("TO_CHAR(officer.join_date, 'YYYY-MM')", 'label')
      .addSelect('COUNT(*)', 'count')
      .groupBy("TO_CHAR(officer.join_date, 'YYYY-MM')")
      .orderBy('label', 'ASC')
      .getRawMany<RawTrendResult>();

    return {
      joinTrend: trendRaw.map((t) => ({
        label: t.label,
        count: parseInt(t.count, 10),
      })),
    };
  }

  private getMockFundStats() {
    // Return mock data for demonstration purposes
    return {
      totalAmount: 1500000000,
      currency: 'VND',
      byDepartment: [
        { type: Department.OFFICE, amount: 300000000 },
        { type: Department.ORGANIZATION, amount: 450000000 },
        { type: Department.PROPAGANDA_EDUCATION, amount: 250000000 },
        { type: Department.POLICIES_LAWS, amount: 200000000 },
        { type: Department.WOMEN_AFFAIRS, amount: 300000000 },
      ],
      yearlyTrend: [
        { year: 2022, amount: 1200000000 },
        { year: 2023, amount: 1350000000 },
        { year: 2024, amount: 1500000000 },
      ],
    };
  }
}
