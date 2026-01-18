import { Controller, Post, Body, UseGuards, Get, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: any) {
        if (!body.email || !body.password) throw new UnauthorizedException('Missing email or password');
        return this.authService.register(body.email, body.password);
    }

    @Post('login')
    async login(@Body() body: any) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('logout')
    logout() {
        return { success: true };
    }

    @Post('forgot-password')
    forgotPassword(@Body() body: any) {
        console.log(`[MOCK] Reset token for ${body.email}: ${Math.random().toString(36).substring(7)}`);
        return { success: true, message: "Check server logs for mock token" };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('change-password')
    async changePassword(@Request() req, @Body() body: any) {
        return this.authService.changePassword(req.user.id, body.oldPassword, body.newPassword);
    }
}
