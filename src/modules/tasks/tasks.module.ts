import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksService } from './Tasks.service';
import { TasksController } from './Tasks.controller';
import { Tasks } from './entities/tasks.entity';
import { MessageModule } from '@/modules/message/message.module';
import { CrawlerService } from '../crawler/crawler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tasks]),
    HttpModule.register({
      timeout: 1000 * 60 * 10,
      maxRedirects: 5,
    }),
    MessageModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, CrawlerService],
})
export class TasksModule {}
