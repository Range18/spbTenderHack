import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { mainConfig } from '#src/common/configs/main.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(mainConfig.port);
}
bootstrap();
