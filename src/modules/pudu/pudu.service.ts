import { Injectable } from '@nestjs/common';

@Injectable()
export class PuduService {
  getHello(): string {
    return 'Hello Pudu!';
  }
}
