import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
  } from '@nestjs/common';
  import { PasetoService } from 'src/paseto/paseto.service';
  import { WsUnauthorizedException } from 'src/socket/socket.exceptions';
  import { PollsService } from './polls.service';
  import { TokenPayload, SocketWithAuth } from './polls.type';
  
  @Injectable()
  export class GatewayAdminGuard implements CanActivate {
    private readonly logger = new Logger(GatewayAdminGuard.name);
    constructor(
      private readonly pollsService: PollsService,
      private readonly pasetoService: PasetoService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      // regular `Socket` from socket.io is probably sufficient
      const socket: SocketWithAuth = context.switchToWs().getClient();
  
      // for testing support, fallback to token header
      const token =
        socket.handshake.auth.token || socket.handshake.headers['token'];
  
      if (!token) {
        this.logger.error('No authorization token provided');
  
        throw new WsUnauthorizedException('No token provided');
      }
  
      try {
        const payload = await this.pasetoService.verifyToken(token);
  
        this.logger.debug(`Validating admin using token payload`, payload);
  
        const { userID, pollID } = payload;
  
        const poll = await this.pollsService.getPoll(pollID);
  
        if (userID !== poll.adminID) {
          this.logger.log("User unauthorized to do this action")
          throw new WsUnauthorizedException('Admin privileges required');
        }
  
        return true;
      } catch {
        throw new WsUnauthorizedException('Admin privileges required');
      }
    }
  }