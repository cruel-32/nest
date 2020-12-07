import { Module, HttpModule } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 1000 * 60 * 10,
      maxRedirects: 5,
    }),
  ],
  providers: [CrawlerService],
  exports: [HttpModule],
})
export class CrawlerModule {}
