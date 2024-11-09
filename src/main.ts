import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { mainConfig } from '#src/common/configs/main.config';
import { globallyLoadPDFJS } from '#src/common/utils/pdfjs-import';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('Tender Hack SPB').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(mainConfig.port);
}
void Promise.all([globallyLoadPDFJS()]).then(() => bootstrap());
