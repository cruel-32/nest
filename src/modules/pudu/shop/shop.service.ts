import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, In } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { Shop } from './entities/shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { parseIntPageMeta } from '@/helper/Common';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}

  async paginate(
    options: IPaginationOptions &
      OrderBy & {
        hasRobot: boolean;
      },
  ): Promise<Pagination<Shop>> {
    const queryBuilder = this.shopRepository.createQueryBuilder('c');
    queryBuilder.orderBy(`c.${options.orderBy}`, options.dir); // Or whatever you need to do

    return parseIntPageMeta(await paginate<Shop>(queryBuilder, options));
  }

  create(createShopDto: CreateShopDto) {
    console.log('createShopDto ::::: ', createShopDto);
    return this.shopRepository.insert(createShopDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} shop`;
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    return `This action updates a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }

  async findAllByIds(ids: number[]) {
    return await this.shopRepository
      .createQueryBuilder()
      .select()
      .where('id', In(ids))
      .execute();
  }
}
