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
import { CreateTasksDto } from './dto/create-Tasks.dto';
import { UpdateTasksDto } from './dto/update-Tasks.dto';
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

  getSubtractDate(day: number): string {
    return new mmt().subtract(day, 'day').format('YYYY-MM-DD');
  }

  @Interval(1000 * 60 * 60 * 2)
  // @Cron('* 0 * * * *')
  async createTodayTask() {
    this.logger.debug(':::: Create Today Task ::::');
    if (!this.messageGateway.taskingId) {
      const date = this.getSubtractDate(3); //매일 하루전 3일전 스케쥴을 등록
      const isExist = await this.tasksRepository
        .findOne({
          where: {
            date,
          },
        })
        .then((item) => !!item?.date);

      if (!isExist) {
        this.create({
          date,
          progress: 'waiting',
          returnEmail: 'mz_choeseunghui@woowafriends.com',
          runningTime: 0,
        });
      }
    }
  }

  @Interval(1000 * 10)
  // @Cron('* * 6 * * *')
  async runTodayTask() {
    if (!this.messageGateway.taskingId) {
      const date = this.getSubtractDate(3);
      console.log('date : ', date);
      const task = await this.tasksRepository.findOne({
        where: {
          progress: In(['waiting', 'failed']),
          date: LessThanOrEqual(date),
        },
        order: {
          date: 'ASC',
        },
      });

      console.log('task :::::: ', task);

      if (task) {
        this.logger.debug(':::: Run Today Task ::::');
        this.crawlerService.crawlingPudu(task.date);
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
    queryBuilder.orderBy('c.date', 'DESC'); // Or whatever you need to do

    return parseIntPageMeta(await paginate<Tasks>(queryBuilder, options));
  }
}
