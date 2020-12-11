import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async paginate(
    options: IPaginationOptions & OrderBy,
  ): Promise<Pagination<Store>> {
    const queryBuilder = this.storeRepository.createQueryBuilder('c');
    queryBuilder.orderBy(`c.${options.orderBy}`, options.dir); // Or whatever you need to do

    return paginate<Store>(this.storeRepository, options);
  }

  create(createStoreDto: CreateStoreDto) {
    console.log('createStoreDto ::::: ', createStoreDto);
    return this.storeRepository.insert(createStoreDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
