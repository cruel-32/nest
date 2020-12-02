import { Injectable } from '@nestjs/common';
import { Roles } from '@/decorators/role.decorator';
import { Role } from '@/enums/role.enum';

@Injectable()
export class AppService {
  @Roles(Role.Admin)
  getHello(): string {
    return 'Hello World!';
  }
}
