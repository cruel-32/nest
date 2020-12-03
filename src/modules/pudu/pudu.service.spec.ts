import { Test, TestingModule } from '@nestjs/testing';
import { PuduService } from '@/pudu.service';

describe('PuduService', () => {
  let service: PuduService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PuduService],
    }).compile();

    service = module.get<PuduService>(PuduService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
