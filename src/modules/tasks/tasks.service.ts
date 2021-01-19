import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, In } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { mmt } from '@/moment';
import { Tasks } from './entities/tasks.entity';
import { CreateTasksDto } from './dto/create-tasks.dto';
import { UpdateTasksDto } from './dto/update-tasks.dto';
import { MessageGateway } from '../message/message.gateway';
import { CrawlerService } from '../crawler/crawler.service';

import { parseIntPageMeta } from '@/helper/Common';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
    private readonly eventEmitter: EventEmitter2,
    private readonly messageGateway: MessageGateway,
    private readonly crawlerService: CrawlerService,
  ) {}

  private readonly logger = new Logger(TasksService.name);

  @Interval(1000 * 60 * 60 * 2)
  // @Cron('* 0 * * * *')
  async createTodayTask() {
    this.logger.debug(':::: Create Today Task Start ::::');
    if (!this.messageGateway.taskingId) {
      const date = new mmt().subtract(3, 'day').format('YYYY-MM-DD'); //매일 하루전 3일전 스케쥴을 등록
      const isExist = await this.tasksRepository
        .findOne({
          where: {
            id: date,
          },
        })
        .then((item) => !!item?.id);

      if (!isExist) {
        this.create({
          id: date,
          progress: 'waiting',
          returnEmail: 'mz_choeseunghui@woowafriends.com',
          runningTime: 0,
          transactionTime: 0,
          message: '',
        });
      }
    }
    this.logger.debug(':::: Create Today Task End ::::');
  }

  @Interval(1000 * 10)
  // @Cron('* * 6 * * *')
  async runTodayTask() {
    if (!this.messageGateway.taskingId) {
      const date = new mmt().subtract(3, 'day').format('YYYY-MM-DD');
      console.log('date : ', date);
      const task = await this.tasksRepository.findOne({
        where: {
          progress: 'waiting',
          id: LessThanOrEqual(date),
        },
        order: {
          id: 'ASC',
        },
      });

      console.log('task :::::: ', task);

      if (task) {
        this.logger.debug(':::: Run Today Task ::::');
        this.crawlerService.crawlingPudu(task.id);
      }
    }
  }

  create(createTasksDto: CreateTasksDto) {
    console.log('create : ', createTasksDto);
    return this.tasksRepository.insert(createTasksDto);
  }

  @OnEvent('tasks.update')
  update(id: string, updateTasksDto: UpdateTasksDto) {
    return this.tasksRepository.update(id, updateTasksDto);
  }

  remove(id: string) {
    return `This action removes a #${id} Tasks`;
  }

  async findTasksWithPaginate(
    options: IPaginationOptions,
  ): Promise<Pagination<Tasks>> {
    const queryBuilder = this.tasksRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.id', 'DESC'); // Or whatever you need to do

    return parseIntPageMeta(await paginate<Tasks>(queryBuilder, options));
  }
}
