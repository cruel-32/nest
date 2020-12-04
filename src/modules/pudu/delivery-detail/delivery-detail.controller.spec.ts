import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryDetailController } from './delivery-detail.controller';
import { DeliveryDetailService } from './delivery-detail.service';

describe('DeliveryDetailController', () => {
  let controller: DeliveryDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryDetailController],
      providers: [DeliveryDetailService],
    }).compile();

    controller = module.get<DeliveryDetailController>(DeliveryDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
