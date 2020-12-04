import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT || 3333;
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 60 * 1000 * 5, // 5 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.setGlobalPrefix('api');
  await app.listen(port);
  console.log(`server is running at http://localhost:${port}`);
}
bootstrap();
