import { Module, HttpModule } from '@nestjs/common';
import { TasksService } from './Tasks.service';
import { TasksController } from './Tasks.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
