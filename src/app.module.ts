import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { join } from 'path';

import { TypeOrmConfig } from './config';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ErrorHandleFilter } from '@/filter/error-handle.filter';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PuduModule } from './modules/pudu/pudu.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { CrawlerModule } from './modules/crawler/crawler.module';
import { MessageModule } from './modules/message/message.module';
import { HealthModule } from './modules/health/health.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot(TypeOrmConfig),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    PuduModule,
    UsersModule,
    AuthModule,
    TasksModule,
    CrawlerModule,
    MessageModule,
    HealthModule,
    StatisticsModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorHandleFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware);
  }
}
