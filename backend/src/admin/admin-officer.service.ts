import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import {
  OfficerProfile,
  Department,
  UnionPosition,
} from '../profile/entities/officer-profile.entity';
import { OfficerQueryDto } from './dto/officer-query.dto';
import { OfficerHistory, ChangeType } from './entities/officer-history.entity';

import { AuthService } from '../auth/auth.service';
import { ProfileService } from '../profile/profile.service';
import { CreateOfficerDto } from './dto/create-officer.dto';
import { UpdateOfficerDto } from './dto/update-officer.dto';

@Injectable()
export class AdminOfficerService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(OfficerProfile)
    private profileRepository: Repository<OfficerProfile>,
    @InjectRepository(OfficerHistory)
    private historyRepository: Repository<OfficerHistory>,
    private authService: AuthService,
    private profileService: ProfileService,
  ) {}

  async create(dto: CreateOfficerDto) {
    const { email, password, fullName, employeeId, department, unionPosition } =
      dto;

    // 1. Create User
    const user = await this.authService.register(email, password);

    // 2. Create Profile
    await this.profileService.create(user.id, {
      fullName,
      employeeId,
      department,
      unionPosition,
    });

    return {
      message: 'Tài khoản cán bộ đã được tạo thành công',
      user: {
        id: user.id,
        email: user.email,
        fullName,
      },
    };
  }

  async findAll(query: OfficerQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      department,
      unionPosition,
      isActive,
      tag,
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.role = :role', { role: UserRole.USER });

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('profile.fullName ILIKE :search', { search: `%${search}%` })
            .orWhere('profile.employeeId ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('user.email ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    if (department) {
      queryBuilder.andWhere('profile.department = :department', { department });
    }

    if (unionPosition) {
      queryBuilder.andWhere('profile.unionPosition = :unionPosition', {
        unionPosition,
      });
    }

    if (tag) {
      queryBuilder.andWhere(':tag = ANY(profile.tags)', { tag });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', {
        isActive: isActive === 'true',
      });
    }

    const [users, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const data = users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      fullName: user.profile?.fullName || '',
      employeeId: user.profile?.employeeId || '',
      unionPosition: user.profile?.unionPosition || '',
      department: user.profile?.department || '',
      tags: user.profile?.tags || [],
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('Officer not found');
    }

    return {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      profile: user.profile,
    };
  }

  async updateStatus(id: string, isActive: boolean) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Officer not found');
    }

    const oldStatus = user.isActive ? 'Đang công tác' : 'Nghỉ';
    const newStatus = isActive ? 'Đang công tác' : 'Nghỉ';

    if (user.isActive !== isActive) {
      user.isActive = isActive;
      await this.usersRepository.save(user);

      // Log history
      await this.historyRepository.save({
        officerId: id,
        changeType: ChangeType.STATUS,
        oldValue: oldStatus,
        newValue: newStatus,
        note: `Cập nhật trạng thái công tác bởi Admin`,
      });
    }

    return {
      message: 'Trạng thái tài khoản đã được cập nhật thành công',
      isActive: user.isActive,
    };
  }

  async update(id: string, dto: UpdateOfficerDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('Officer not found');
    }

    if (user.profile) {
      const oldDepartment = user.profile.department;
      const newDepartment = dto.department;

      Object.assign(user.profile, dto);
      await this.profileRepository.save(user.profile);

      // Log history for department change
      if (newDepartment && oldDepartment !== newDepartment) {
        await this.historyRepository.save({
          officerId: id,
          changeType: ChangeType.UNIT,
          oldValue: oldDepartment,
          newValue: newDepartment,
          note: `Cập nhật đơn vị công tác bởi Admin`,
        });
      }
    }

    return {
      message: 'Thông tin cán bộ đã được cập nhật thành công',
      data: await this.findOne(id),
    };
  }

  async getHistory(id: string) {
    const history = await this.historyRepository.find({
      where: { officerId: id },
      order: { changeDate: 'DESC' },
    });
    return history;
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Officer not found');
    }

    // Since Profile has onDelete: 'CASCADE', deleting the user will delete the profile
    await this.usersRepository.remove(user);

    return {
      message: 'Cán bộ đã được xóa khỏi hệ thống',
    };
  }

  async seedData() {
    const users = await this.usersRepository.find({
      relations: ['profile'],
      where: { role: UserRole.USER },
    });

    const tagsList = [
      'Cán bộ nguồn',
      'Chuẩn bị nghỉ hưu',
      'Cán bộ nữ',
      'Cán bộ trẻ',
    ];

    let updatedCount = 0;

    for (const user of users) {
      if (!user.profile) continue;

      // Seed Tags if empty
      if (!user.profile.tags || user.profile.tags.length === 0) {
        const randomTags = tagsList
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 2) + 1);
        user.profile.tags = randomTags;
        await this.profileRepository.save(user.profile);
      }

      // Seed History if empty
      const historyCount = await this.historyRepository.count({
        where: { officerId: user.id },
      });

      if (historyCount === 0) {
        const pastDate = new Date();
        pastDate.setMonth(pastDate.getMonth() - Math.floor(Math.random() * 12));

        await this.historyRepository.save({
          officerId: user.id,
          changeType: ChangeType.UNIT,
          oldValue: 'Ban cũ A',
          newValue: user.profile.department,
          note: 'Điều chuyển công tác định kỳ',
          changeDate: pastDate,
        });

        updatedCount++;
      }
    }

    return { message: `Seeded data for ${updatedCount} officers` };
  }

  async createUnitAdmin() {
    const email = 'unitadmin@union.com';
    const password = 'password123';

    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      return { message: 'Unit Admin already exists' };
    }

    // Register user
    const user = await this.authService.register(email, password);

    // Update role to UNIT_ADMIN
    user.role = UserRole.UNIT_ADMIN;
    await this.usersRepository.save(user);

    // Create profile
    await this.profileService.create(user.id, {
      fullName: 'Quản lý Ban Tổ chức',
      employeeId: 'UA001',
      department: Department.ORGANIZATION,
      unionPosition: UnionPosition.EXECUTIVE_COMMITTEE_MEMBER,
    });

    return { message: 'Unit Admin created successfully' };
  }
}
