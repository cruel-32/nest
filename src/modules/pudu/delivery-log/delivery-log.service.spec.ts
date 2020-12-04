import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryLogService } from './delivery-log.service';

describe('DeliveryLogService', () => {
  let service: DeliveryLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryLogService],
    }).compile();

    service = module.get<DeliveryLogService>(DeliveryLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
