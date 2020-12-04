import { Injectable } from '@nestjs/common';
import { CreateDeliveryLogDto } from './dto/create-delivery-log.dto';
import { UpdateDeliveryLogDto } from './dto/update-delivery-log.dto';

@Injectable()
export class DeliveryLogService {
  create(createDeliveryLogDto: CreateDeliveryLogDto) {
    return 'This action adds a new deliveryLog';
  }

  findAll() {
    return `This action returns all deliveryLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deliveryLog`;
  }

  update(id: number, updateDeliveryLogDto: UpdateDeliveryLogDto) {
    return `This action updates a #${id} deliveryLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} deliveryLog`;
  }
}
