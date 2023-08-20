import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';
import { faker } from '@faker-js/faker';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['https://backend-nguyenhoanghieu1.vercel.app/'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(json({ limit: '50mb' }));
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  app.useStaticAssets(`src/upload/`, { prefix: '/upload/' });
  await app.listen(4000);
}
bootstrap();
