import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository, Transaction, TransactionRepository } from 'typeorm';

import { Robot } from './entities/robot.entity';
import { CreateRobotDto } from './dto/create-robot.dto';
import { UpdateRobotDto } from './dto/update-robot.dto';

@Injectable()
export class RobotService {
  constructor(
    @InjectRepository(Robot)
    private readonly robotRepository: Repository<Robot>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  create(createRobotDto: CreateRobotDto) {
    console.log('createRobotDto : ', createRobotDto);
    return this.robotRepository.insert(createRobotDto);
  }

  findAll() {
    return `This action returns all robot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} robot`;
  }

  update(id: number, updateRobotDto: UpdateRobotDto) {
    return `This action updates a #${id} robot`;
  }

  remove(id: number) {
    return `This action removes a #${id} robot`;
  }
}
