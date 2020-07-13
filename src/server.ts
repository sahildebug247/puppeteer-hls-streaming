import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');

  app.enableCors();

  const port = process.env.PORT || 3001;
  await app.listen(port);
}

bootstrap();
