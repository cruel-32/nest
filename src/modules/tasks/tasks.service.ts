import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
import { MessageGateway } from '../message/message.gateway';
import { CrawlerService } from '../crawler/crawler.service';

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

  getYesterdayStr(): string {
    return new mmt().subtract(1, 'day').format('YYYY-MM-DD');
  }

  @Interval(1000 * 10)
  // @Cron('* 0 * * * *')
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
      this.create({
        date,
        progress: 'waiting',
        returnEmail: 'mz_choeseunghui@woowafriends.com',
      });
    }
  }

  @Interval(1000 * 10)
  async runTodayTask() {
    console.log(
      'this.messageGateway.taskingId : ',
      this.messageGateway.taskingId,
    );
    if (!this.messageGateway.taskingId) {
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
        this.messageGateway.taskingId = date;
        // this.update(date, { progress: 'running' });
        this.crawlerService.crawlingPudu(date);
      }
    }
  }

  create(createTasksDto: CreateTasksDto) {
    console.log('create : ', createTasksDto);
    return this.tasksRepository.insert(createTasksDto);
  }

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

    return paginate<Tasks>(this.tasksRepository, options);
  }
}
