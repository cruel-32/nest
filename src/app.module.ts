import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerMiddleware } from '@/middleware/logger.middleware';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { PuduModule } from '@/pudu/pudu.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';

import { RolesGuard } from '@/roles.guard';

@Module({
  imports: [TypeOrmModule.forRoot(), PuduModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware);
  }
}
