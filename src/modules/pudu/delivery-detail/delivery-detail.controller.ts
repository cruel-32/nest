import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { DeliveryDetailService } from './delivery-detail.service';
import { CreateDeliveryDetailDto } from './dto/create-delivery-detail.dto';
import { UpdateDeliveryDetailDto } from './dto/update-delivery-detail.dto';

@Controller('delivery-detail')
export class DeliveryDetailController {
  constructor(private readonly deliveryDetailService: DeliveryDetailService) {}

  @Post()
  create(@Body() createDeliveryDetailDto: CreateDeliveryDetailDto) {
    return this.deliveryDetailService.create(createDeliveryDetailDto);
  }

  @Get()
  findAll() {
    return this.deliveryDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryDetailService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeliveryDetailDto: UpdateDeliveryDetailDto,
  ) {
    return this.deliveryDetailService.update(+id, updateDeliveryDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryDetailService.remove(+id);
  }
}
