import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/user.entity';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // Helper method to generate random token
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // Check if email is verified
      if (!user.isEmailVerified) {
        throw new UnauthorizedException(
          'Email chưa được xác thực. Vui lòng kiểm tra email của bạn.',
        );
      }
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
      },
    };
  }

  async register(email: string, pass: string) {
    const existing = await this.usersService.findOneByEmail(email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    const hash = await bcrypt.hash(pass, 10);

    // Generate verification token
    const verificationToken = this.generateToken();
    const verificationTokenExpiresAt = new Date();
    verificationTokenExpiresAt.setHours(
      verificationTokenExpiresAt.getHours() + 24,
    ); // 24 hours

    const newUser = await this.usersService.create(email, hash, UserRole.USER);

    // Update user with verification token
    newUser.emailVerificationToken = verificationToken;
    newUser.emailVerificationTokenExpiresAt = verificationTokenExpiresAt;
    await this.usersService.update(newUser);

    // Send verification email
    try {
      await this.emailService.sendEmailVerification(email, verificationToken);
    } catch (error) {
      console.error('[AuthService] Failed to send verification email:', error);
      // Continue even if email fails - user can request resend later (out of scope for MVP)
    }

    const { passwordHash, ...result } = newUser;
    return result;
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findOneByVerificationToken(token);

    if (!user) {
      throw new BadRequestException('Token xác thực không hợp lệ');
    }

    if (
      !user.emailVerificationTokenExpiresAt ||
      user.emailVerificationTokenExpiresAt < new Date()
    ) {
      throw new BadRequestException('Token xác thực đã hết hạn');
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiresAt = null;
    await this.usersService.update(user);

    return { success: true, message: 'Email đã được xác thực thành công' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);

    // Always return success to avoid revealing email existence
    if (!user) {
      return {
        success: true,
        message:
          'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu',
      };
    }

    // Generate reset token
    const resetToken = this.generateToken();
    const resetTokenExpiresAt = new Date();
    resetTokenExpiresAt.setHours(resetTokenExpiresAt.getHours() + 1); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiresAt = resetTokenExpiresAt;
    await this.usersService.update(user);

    // Send password reset email
    try {
      await this.emailService.sendPasswordReset(email, resetToken);
    } catch (error) {
      console.error(
        '[AuthService] Failed to send password reset email:',
        error,
      );
    }

    return {
      success: true,
      message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findOneByResetToken(token);

    if (!user) {
      throw new BadRequestException('Token đặt lại mật khẩu không hợp lệ');
    }

    if (
      !user.passwordResetTokenExpiresAt ||
      user.passwordResetTokenExpiresAt < new Date()
    ) {
      throw new BadRequestException('Token đặt lại mật khẩu đã hết hạn');
    }

    // Update password
    const newHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newHash;

    // Invalidate reset token
    user.passwordResetToken = null;
    user.passwordResetTokenExpiresAt = null;
    await this.usersService.update(user);

    return { success: true, message: 'Mật khẩu đã được đặt lại thành công' };
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
