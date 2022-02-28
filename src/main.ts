import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from "dotenv";
import {ValidationPipe} from "@nestjs/common";
import { validate } from 'class-validator';

async function bootstrap() {
  // dotenv.config()
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true
  }));
  await app.listen(process.env.PORT || 4000);

}
bootstrap();
