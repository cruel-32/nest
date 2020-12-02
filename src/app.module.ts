import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PuduModule } from './pudu/pudu.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PuduModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
