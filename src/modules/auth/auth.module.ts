import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';

import { AuthService } from '@/modules/auth/auth.service';
import { LocalStrategy } from '@/modules/auth/strategies/local.strategy';
import { UsersModule } from '@/modules/users/users.module';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import { AuthController } from './auth.controller';

const commonConfig = config();

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: commonConfig.parsed.SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
