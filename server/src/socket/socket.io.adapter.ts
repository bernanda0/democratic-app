import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { PasetoService } from 'src/paseto/paseto.service';
import { SocketWithAuth } from 'src/polls/polls.type';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(
    private app: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const clientPort = parseInt(this.configService.get('CLIENT_PORT'));

    const cors = {
      origin: [
        `http://localhost:${clientPort}`,
        new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
      ],
    };

    this.logger.log('Configuring SocketIO server with custom CORS options', {
      cors,
    });

    const optionsWithCORS: ServerOptions = {
      ...options,
      cors,
    };

    const pasetoService = this.app.get(PasetoService);
    const server: Server = super.createIOServer(port, optionsWithCORS)
    server.of('polls').use(createPaseto(pasetoService, this.logger))
    
    return server
  }
}

const createPaseto =
  (pasetoService: PasetoService, logger: Logger) =>
  async (socket: SocketWithAuth, next) => {
    // for Postman testing support, fallback to token header
    const token =
      socket.handshake.auth.token || socket.handshake.headers['token'];

    logger.debug(`Validating auth token before connection: ${token}`);

    try {
      const payload = await pasetoService.verifyToken(token);
      socket.userID = payload.userID;
      socket.pollID = payload.pollID;
      socket.name = payload.name;
      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
  };