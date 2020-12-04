import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryDetailService } from './delivery-detail.service';

describe('DeliveryDetailService', () => {
  let service: DeliveryDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryDetailService],
    }).compile();

    service = module.get<DeliveryDetailService>(DeliveryDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
