import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { DeliveryLogService } from './delivery-log.service';
import { CreateDeliveryLogDto } from './dto/create-delivery-log.dto';
import { UpdateDeliveryLogDto } from './dto/update-delivery-log.dto';

@Controller('delivery-log')
export class DeliveryLogController {
  constructor(private readonly deliveryLogService: DeliveryLogService) {}

  @Post()
  create(@Body() createDeliveryLogDto: CreateDeliveryLogDto) {
    return this.deliveryLogService.create(createDeliveryLogDto);
  }

  @Get()
  findAll() {
    return this.deliveryLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryLogService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeliveryLogDto: UpdateDeliveryLogDto,
  ) {
    return this.deliveryLogService.update(+id, updateDeliveryLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryLogService.remove(+id);
  }
}
