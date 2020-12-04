import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { mmt } from '@/moment';
import { Tasks } from './entities/tasks.entity';
import { CreateTasksDto } from './dto/create-Tasks.dto';
import { UpdateTasksDto } from './dto/update-Tasks.dto';
import { Moment } from 'moment';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
    private readonly httpService: HttpService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  getYesterdayStr(): Moment {
    return new mmt().subtract(1, 'day').format('YYYY-MM-DD');
  }

  // @Interval(3000)
  @Cron('* 0 * * * *')
  async createTodayTask() {
    this.logger.debug(':::: Create Today Task ::::');
    const date = this.getYesterdayStr();
    const isExist = await this.tasksRepository
      .findOne({
        where: {
          date,
        },
      })
      .then((item) => !!item?.date);

    if (!isExist) {
      this.eventEmitter.emit('tasks.createToday', {
        date,
      });
    }
  }

  @Interval(1000 * 10)
  async runTodayTask() {
    this.logger.debug(':::: Run Today Task ::::');
    const date = this.getYesterdayStr();
    const isExist = await this.tasksRepository
      .findOne({
        where: {
          date,
          progress: 'waiting',
        },
      })
      .then((item) => !!item?.date);

    if (isExist) {
      this.eventEmitter.emit('tasks.updateToday', date, {
        progress: 'running',
      });
    }
  }

  @OnEvent('tasks.createToday')
  create(createTasksDto: CreateTasksDto) {
    return this.tasksRepository.insert(createTasksDto);
  }

  @OnEvent('tasks.updateToday')
  update(id: number, updateTasksDto: UpdateTasksDto) {
    return this.tasksRepository.update(id, updateTasksDto);
  }

  remove(id: number) {
    return `This action removes a #${id} Tasks`;
  }

  async findTasksWithPaginate(
    options: IPaginationOptions,
  ): Promise<Pagination<Tasks>> {
    const queryBuilder = this.tasksRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.date', 'DESC'); // Or whatever you need to do

    return paginate<Tasks>(this.tasksRepository, options);
  }
}
