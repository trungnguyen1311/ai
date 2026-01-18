import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        };
    }

    async register(email: string, pass: string) {
        const existing = await this.usersService.findOneByEmail(email);
        if (existing) {
            throw new ConflictException('Email already exists');
        }
        const hash = await bcrypt.hash(pass, 10);
        const newUser = await this.usersService.create(email, hash, UserRole.USER);
        const { passwordHash, ...result } = newUser;
        return result;
    }

    async changePassword(userId: string, oldPass: string, newPass: string) {
        const user = await this.usersService.findOneById(userId);
        if (!user) throw new UnauthorizedException();

        const isMatch = await bcrypt.compare(oldPass, user.passwordHash);
        if (!isMatch) throw new UnauthorizedException('Wrong old password');

        const newHash = await bcrypt.hash(newPass, 10);
        user.passwordHash = newHash;
        await this.usersService.update(user);
        return { success: true };
    }
}
