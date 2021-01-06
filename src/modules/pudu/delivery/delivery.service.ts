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

import { parseIntPageMeta } from '@/helper/Common';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Delivery>> {
    const queryBuilder = this.deliveryRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.name', 'DESC'); // Or whatever you need to do

    return parseIntPageMeta(await paginate<Delivery>(queryBuilder, options));
  }

  findAll() {
    return this.deliveryRepository.find();
  }

  create(createDeliveryDto: CreateDeliveryDto) {
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
