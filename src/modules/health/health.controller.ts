import { Controller, Get, Post, Body } from '@nestjs/common';

import { Public } from '@/decorators/jwt.decorator';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  healthCheck() {
    return this.healthService.getServerHealth();
  }

  @Public()
  @Post()
  healthCheckPost(@Body() testDto: { message: string }) {
    const { message } = testDto;

    console.log('message : ', message);

    return this.healthService.getServerHealth();
  }
}
