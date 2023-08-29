import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './socket/socket.io.adapter';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // CORS config
  const clientPort = parseInt(configService.get('CLIENT_PORT'));
  app.enableCors({
    origin: [
      `http://127.0.0.1:${clientPort}`
    ],
  });

  // Validator middleware
  app.useGlobalPipes(new ValidationPipe());

  // socket
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  const port = parseInt(configService.get('PORT'));
  const ipAddress = '127.0.0.1';
  await app.listen(port, ipAddress);

  logger.log(`Server running on host ${ipAddress}:${port}`);
}

bootstrap();
