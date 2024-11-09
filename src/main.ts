import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { mainConfig } from '#src/common/configs/main.config';
import { globallyLoadPDFJS } from '#src/common/utils/pdfjs-import';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '#src/common/exception-handler/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder().setTitle('Tender Hack SPB').build();
  const document = SwaggerModule.createDocument(app, config, {
    autoTagControllers: true,
  });
  SwaggerModule.setup('docs', app, document);

  app.enableShutdownHooks();

  await app.listen(mainConfig.port);
}
void Promise.all([globallyLoadPDFJS()]).then(() => bootstrap());
