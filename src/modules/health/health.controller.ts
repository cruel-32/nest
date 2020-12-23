import { Controller, Get } from '@nestjs/common';

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
}
