import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config as awsConfig } from 'aws-sdk';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('AWS S3 Files Management API documentation')
    .setDescription('Endpoints to test the backend API.')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('files')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  // Validation setup
  app.useGlobalPipes(new ValidationPipe());

  // AWS S3 setup
  awsConfig.update({
      accessKeyId: process.env.AWS_S3_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET,
  });
  await app.listen(3000);
}
bootstrap();
