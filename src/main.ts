import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

import { WsAdapter } from '@nestjs/platform-ws';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT || 3333;
  app.useWebSocketAdapter(new WsAdapter(app));
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.use(
    rateLimit({
      windowMs: 60 * 1000 * 5, // 5 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // validation을 위한 decorator가 붙어있지 않은 속성들은 제거
      forbidNonWhitelisted: true, // whitelist 설정을 켜서 걸러질 속성이 있다면 아예 요청 자체를 막도록 (400 에러)
      transform: true, // 요청에서 넘어온 자료들의 형변환
    }),
  );
  await app.listen(port);
  console.log(`server is running at http://localhost:${port}`);
}
bootstrap();
