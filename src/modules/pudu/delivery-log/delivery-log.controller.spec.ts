import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryLogController } from './delivery-log.controller';
import { DeliveryLogService } from './delivery-log.service';

describe('DeliveryLogController', () => {
  let controller: DeliveryLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryLogController],
      providers: [DeliveryLogService],
    }).compile();

    controller = module.get<DeliveryLogController>(DeliveryLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
