import { Controller, Get } from '@nestjs/common';
import { PuduService } from './pudu.service';

@Controller('pudu')
export class PuduController {
  constructor(private readonly puduService: PuduService) {}

  @Get('hello')
  getHello(): string {
    return this.puduService.getHello();
  }
}
