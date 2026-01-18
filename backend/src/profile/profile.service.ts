import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfficerProfile } from './entities/officer-profile.entity';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(OfficerProfile)
        private profileRepository: Repository<OfficerProfile>,
    ) { }

    async create(userId: string, createProfileDto: CreateProfileDto): Promise<OfficerProfile> {
        const existing = await this.profileRepository.findOne({ where: { userId } });
        if (existing) {
            throw new ConflictException('Profile already exists for this user');
        }

        const { employeeId } = createProfileDto;
        // Check if employeeId is unique
        const existingEmployee = await this.profileRepository.findOne({ where: { employeeId } });
        if (existingEmployee) {
            throw new ConflictException('Employee ID is already in use');
        }

        const profile = this.profileRepository.create({
            userId,
            ...createProfileDto,
        });

        return this.profileRepository.save(profile);
    }

    async findOne(userId: string): Promise<OfficerProfile> {
        const profile = await this.profileRepository.findOne({ where: { userId } });
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }
        return profile;
    }

    async update(userId: string, updateProfileDto: UpdateProfileDto): Promise<OfficerProfile> {
        const profile = await this.findOne(userId);

        // Merge updates
        Object.assign(profile, updateProfileDto);

        return this.profileRepository.save(profile);
    }
}
