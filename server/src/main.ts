import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // CORS config
  const clientPort = parseInt(configService.get('CLIENT_PORT'));
  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`
    ],
  });

  // Validator middleware
  app.useGlobalPipes(new ValidationPipe());

  const port = parseInt(configService.get('PORT'));
  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}

bootstrap();
