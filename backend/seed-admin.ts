import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AuthService } from './src/auth/auth.service';
import { UserRole } from './src/users/user.entity';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  const usersService = app.get(UsersService);

  const adminEmail = 'admin@system.com';
  const adminPass = 'Admin@123';

  const existing = await usersService.findOneByEmail(adminEmail);
  if (existing) {
    console.log('Admin already exists. Updating role to ADMIN...');
    existing.role = UserRole.ADMIN;
    await usersService.update(existing);
    console.log('Admin role updated.');
  } else {
    console.log('Creating new Admin account...');
    await authService.register(adminEmail, adminPass);
    const user = await usersService.findOneByEmail(adminEmail);
    if (user) {
      user.role = UserRole.ADMIN;
      await usersService.update(user);
      console.log('Admin account created successfully.');
    }
  }

  await app.close();
}

bootstrap().catch((err) => {
  console.error('Error seeding admin:', err);
  process.exit(1);
});
