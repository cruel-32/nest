import { Module, HttpModule } from '@nestjs/common';

import { MessageModule } from '@/modules/message/message.module';
import { RobotModule } from '@/modules/pudu/robot/robot.module';
import { DeliveryModule } from '@/modules/pudu/delivery/delivery.module';

import { CrawlerService } from './crawler.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 1000 * 60 * 10,
      maxRedirects: 5,
    }),
    RobotModule,
    DeliveryModule,
    MessageModule,
  ],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
