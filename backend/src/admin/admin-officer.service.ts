import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { OfficerProfile } from '../profile/entities/officer-profile.entity';
import { OfficerQueryDto } from './dto/officer-query.dto';

import { AuthService } from '../auth/auth.service';
import { ProfileService } from '../profile/profile.service';
import { CreateOfficerDto } from './dto/create-officer.dto';

@Injectable()
export class AdminOfficerService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(OfficerProfile)
    private profileRepository: Repository<OfficerProfile>,
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

    user.isActive = isActive;
    await this.usersRepository.save(user);

    return {
      message: 'Trạng thái tài khoản đã được cập nhật thành công',
      isActive: user.isActive,
    };
  }
}
