import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { LoggerMiddleware } from '@/middleware/logger.middleware';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { PuduModule } from '@/modules/pudu/pudu.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: '127.0.0.1',
      port: 3399,
      username: 'root',
      password: '1212',
      database: 'robot',
      entities: ['src/entities/*.entity{.ts}'],
      logging: true,
      synchronize: false,
    }),
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
