import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import {
  OfficerProfile,
  Department,
  UnionPosition,
  WorkStatus,
  Gender,
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

    // Helper to pick random item
    const rand = (list: any[]) => list[Math.floor(Math.random() * list.length)];
    // Helper for random date between start and end
    const randomDate = (start: Date, end: Date) =>
      new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime()),
      );

    const eduList = [
      'Đại học Luật Hà Nội - Cử nhân Luật\nHọc viện Chính trị - Cao cấp lý luận chính trị',
      'Đại học Kinh tế Quốc dân - Cử nhân Kinh tế\nThạc sĩ Quản trị Kinh doanh',
      'Đại học Bách Khoa Hà Nội - Kỹ sư CNTT\nVăn bằng 2 Luật',
      'Học viện Hành chính Quốc gia - Cử nhân Quản lý nhà nước',
      'Đại học Công đoàn - Cử nhân Công tác xã hội',
    ];
    const expList = [
      '2010-2015: Chuyên viên tại Ban Pháp chế\n2015-2020: Phó Ban Pháp chế\n2020-Nay: Trưởng Ban Chính sách Pháp luật',
      '2012-2016: Cán bộ Công đoàn cơ sở\n2016-Nay: Chuyên viên Ban Tổ chức',
      '2015-2018: Giảng viên Đại học\n2018-Nay: Cán bộ chuyên trách',
      '2018-Nay: Chuyên viên Văn phòng',
      '2019-2022: Bí thư Đoàn thanh niên\n2022-Nay: Chuyên viên Ban Tuyên giáo',
    ];
    const skillList = [
      'Lãnh đạo, Quản lý dự án, Đàm phán, Thuyết trình public',
      'Tin học văn phòng, Tiếng Anh giao tiếp, Kỹ năng mềm',
      'Tổ chức sự kiện, Viết báo cáo, Phân tích số liệu',
      'Giải quyết xung đột, Tư vấn pháp luật',
      'Kỹ năng làm việc nhóm, Quản lý thời gian, Tư duy phản biện',
    ];
    const achieveList = [
      'Huân chương Lao động hạng Ba (2019)\nBằng khen Thủ tướng Chính phủ (2022)',
      'Chiến sĩ thi đua cấp cơ sở (2020, 2021)',
      'Bằng khen Tổng Liên đoàn (2023)',
      'Giấy khen Chủ tịch UBND Thành phố (2021)',
      'Bằng khen Công đoàn ngành (2022)',
    ];
    const unitList = [
      'Liên đoàn Lao động TP',
      'Công đoàn Ngành Giáo dục',
      'Công đoàn Khu Công nghiệp',
      'Công đoàn Viên chức TP',
      'Công đoàn Ngành Y tế',
    ];
    const addressList = [
      'Đường Láng, Hà Nội',
      'Quận Cầu Giấy, Hà Nội',
      'Quận Hoàn Kiếm, Hà Nội',
      'Quận Hai Bà Trưng, Hà Nội',
      'Quận Thanh Xuân, Hà Nội',
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

      // Seed Extended Profile Info if empty
      if (!user.profile.education) {
        user.profile.education = rand(eduList);
        user.profile.experience = rand(expList);
        user.profile.skills = rand(skillList);
        user.profile.achievements = rand(achieveList);
        user.profile.unitName = rand(unitList);
        // 90% Active, 5% Transferred, 5% Retired
        const statusRand = Math.random();
        user.profile.workStatus =
          statusRand > 0.9
            ? WorkStatus.RETIRED
            : statusRand > 0.85
              ? WorkStatus.TRANSFERRED
              : WorkStatus.ACTIVE;
        user.profile.gender = Math.random() > 0.5 ? Gender.MALE : Gender.FEMALE;
        user.profile.dateOfBirth = randomDate(
          new Date(1975, 0, 1),
          new Date(1995, 0, 1),
        );
        user.profile.nationalId =
          '0' +
          Math.floor(Math.random() * 100000000000)
            .toString()
            .padStart(11, '0');
        user.profile.phoneNumber =
          '09' +
          Math.floor(Math.random() * 100000000)
            .toString()
            .padStart(8, '0');
        user.profile.personalEmail = user.email;
        user.profile.address = `${Math.floor(Math.random() * 100)} ${rand(addressList)}`;
        user.profile.joinDate = randomDate(
          new Date(2010, 0, 1),
          new Date(2023, 0, 1),
        );
        user.profile.isPartyMember = Math.random() > 0.4;

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
