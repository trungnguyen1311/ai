import { Controller, Get, Body, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post('/me')
    create(@Request() req, @Body() createProfileDto: CreateProfileDto) {
        // req.user has { id, email, role } from JwtStrategy headers
        return this.profileService.create(req.user.id, createProfileDto);
    }

    @Get('/me')
    findOne(@Request() req) {
        return this.profileService.findOne(req.user.id);
    }

    @Patch('/me')
    update(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.profileService.update(req.user.id, updateProfileDto);
    }
}
