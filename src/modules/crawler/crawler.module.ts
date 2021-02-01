import { Module, HttpModule } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';

import { MessageModule } from '@/modules/message/message.module';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 1000 * 60 * 60, //60분
      maxRedirects: 5,
    }),
    MessageModule,
    PuppeteerModule.forRoot(),
  ],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
