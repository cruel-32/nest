import { Module, HttpModule } from '@nestjs/common';

import { MessageModule } from '@/modules/message/message.module';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 1000 * 60 * 20, //10분
      maxRedirects: 5,
    }),
    MessageModule,
  ],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
