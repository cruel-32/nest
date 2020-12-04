import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { CreateTasksDto } from './dto/create-Tasks.dto';
import { UpdateTasksDto } from './dto/update-Tasks.dto';

@Injectable()
export class TasksService {
  constructor(private httpService: HttpService) {}

  private readonly logger = new Logger(TasksService.name);

  @Cron('0 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 0');
  }

  create(createTasksDto: CreateTasksDto) {
    return 'This action adds a new Tasks';
  }

  findAll() {
    return `This action returns all Tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} Tasks`;
  }

  update(id: number, updateTasksDto: UpdateTasksDto) {
    return `This action updates a #${id} Tasks`;
  }

  remove(id: number) {
    return `This action removes a #${id} Tasks`;
  }
}
