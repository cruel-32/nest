import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksService } from './Tasks.service';
import { TasksController } from './Tasks.controller';
import { Tasks } from './entities/tasks.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tasks]),
    HttpModule.register({
      timeout: 1000 * 10,
      maxRedirects: 5,
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
