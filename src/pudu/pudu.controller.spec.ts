import { Test, TestingModule } from '@nestjs/testing';
import { PuduController } from '@/pudu.controller';

describe('PuduController', () => {
  let controller: PuduController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuduController],
    }).compile();

    controller = module.get<PuduController>(PuduController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
