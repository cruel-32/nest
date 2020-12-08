import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageModule } from '@/modules/message/message.module';
import { TasksService } from './Tasks.service';
import { TasksController } from './Tasks.controller';
import { Tasks } from './entities/tasks.entity';
import { CrawlerModule } from '../crawler/crawler.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tasks]),
    HttpModule.register({
      timeout: 1000 * 60 * 10,
      maxRedirects: 5,
    }),
    CrawlerModule,
    MessageModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
