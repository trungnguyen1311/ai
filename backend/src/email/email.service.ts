import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmailVerification(email: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM'),
      to: email,
      subject: 'Xác thực tài khoản - Union Officer Management',
      text: `
Xin chào,

Cảm ơn bạn đã đăng ký tài khoản tại Union Officer Management System.

Vui lòng click vào link dưới đây để xác thực email của bạn:
${verificationUrl}

Link này sẽ hết hạn sau 24 giờ.

Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.

Trân trọng,
Union Officer Management Team
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[EmailService] Verification email sent to ${email}`);
    } catch (error) {
      console.error('-----------------------------------------');
      console.error('[EmailService] GỬI MAIL THẤT BẠI!');
      console.error(`[EmailService] Link xác thực của bạn: ${verificationUrl}`);
      console.log(
        'Lỗi chi tiết:',
        error instanceof Error ? error.message : error,
      );
      console.error('-----------------------------------------');
      // Không throw error ở đây để không làm gián đoạn luồng đăng ký khi đang test
      return;
    }
  }

  async sendPasswordReset(email: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: this.configService.get<string>('SMTP_FROM'),
      to: email,
      subject: 'Đặt lại mật khẩu - Union Officer Management',
      text: `
Xin chào,

Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.

Vui lòng click vào link dưới đây để đặt lại mật khẩu:
${resetUrl}

Link này sẽ hết hạn sau 1 giờ.

Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.

Trân trọng,
Union Officer Management Team
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`[EmailService] Password reset email sent to ${email}`);
    } catch (error) {
      console.error('-----------------------------------------');
      console.error('[EmailService] GỬI MAIL ĐẶT LẠI MẬT KHẨU THẤT BẠI!');
      console.error(`[EmailService] Link của bạn: ${resetUrl}`);
      console.log(
        'Lỗi chi tiết:',
        error instanceof Error ? error.message : error,
      );
      console.error('-----------------------------------------');
      return;
    }
  }
}
