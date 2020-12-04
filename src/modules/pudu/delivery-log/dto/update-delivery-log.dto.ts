import { PartialType } from '@nestjs/mapped-types';
import { CreateDeliveryLogDto } from './create-delivery-log.dto';

export class UpdateDeliveryLogDto extends PartialType(CreateDeliveryLogDto) {}
