import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { mainConfig } from '#src/common/configs/main.config';
import { globallyLoadPDFJS } from '#src/common/utils/pdfjs-import';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(mainConfig.port);
}
void Promise.all([globallyLoadPDFJS()]).then(() => bootstrap());
