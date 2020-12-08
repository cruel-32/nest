import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { Delivery } from './entities/delivery.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
  ) {}

  // findAll(): Promise<Delivery[] | undefined> {
  //   return this.deliveryRepository.find({
  //     take: 5,
  //   });
  // }

  async paginate(options: IPaginationOptions): Promise<Pagination<Delivery>> {
    const queryBuilder = this.deliveryRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.name', 'DESC'); // Or whatever you need to do

    return paginate<Delivery>(this.deliveryRepository, options);
  }

  create(createDeliveryDto: CreateDeliveryDto) {
    console.log('createDeliveryDto ::::: ', createDeliveryDto);
    return this.deliveryRepository.insert(createDeliveryDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  update(id: number, updateDeliveryDto: UpdateDeliveryDto) {
    return `This action updates a #${id} delivery`;
  }

  remove(id: number) {
    return `This action removes a #${id} delivery`;
  }
}
