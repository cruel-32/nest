import { Controller, Get } from '@nestjs/common';
import { PuduService } from '@/pudu/pudu.service';

@Controller('pudu')
export class PuduController {
  constructor(private readonly puduService: PuduService) {}

  @Get()
  getHello(): string {
    return this.puduService.getHello();
  }
}
