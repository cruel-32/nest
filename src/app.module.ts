import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { DevTypeOrmConfig, ProdTypeOrmConfig } from '@/config';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { LoggerMiddleware } from '@/middleware/logger.middleware';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { PuduModule } from '@/modules/pudu/pudu.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? ProdTypeOrmConfig
        : DevTypeOrmConfig,
    ),
    PuduModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware);
  }
}
