import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(email: string, passwordHash: string, role: UserRole = UserRole.USER): Promise<User> {
        const user = this.usersRepository.create({
            email,
            passwordHash,
            role,
        });
        return this.usersRepository.save(user);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    async findOneById(id: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }

    async update(user: User): Promise<User> {
        return this.usersRepository.save(user);
    }
}
