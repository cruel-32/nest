import { HttpService, Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mmt } from '@/moment';

import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { Tasks } from './entities/tasks.entity';
import { CreateTasksDto } from './dto/create-Tasks.dto';
import { UpdateTasksDto } from './dto/update-Tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    private httpService: HttpService,
    private eventEmitter: EventEmitter2,
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  // @Cron('0 * * * * *')
  // @Interval(1000)
  checkTask() {
    this.logger.debug(':::: Check task ::::');
    this.eventEmitter.emit('task.findOne', 1);
  }

  // @Interval(5000)
  // handleInterval() {
  //   this.logger.debug('5초에 한번씩');
  //   this.eventEmitter.emit('task.findOne', 1);
  // }
  findLastest(param: any) {
    return this.tasksRepository.findOne({
      where: {},
    });
  }

  async create(createTasksDto: CreateTasksDto) {
    return this.tasksRepository.insert(createTasksDto);
  }

  findAll() {
    return `This action returns all Tasks`;
  }

  @OnEvent('task.findOne')
  findOne(id: number) {
    this.logger.debug(`This action returns a #${id} Tasks`);
    return `This action returns a #${id} Tasks`;
  }

  update(id: number, updateTasksDto: UpdateTasksDto) {
    return `This action updates a #${id} Tasks`;
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
