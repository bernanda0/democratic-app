import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PasetoService } from 'src/paseto/paseto.service';

@Injectable()
export class ControllerPollsGuard implements CanActivate {
  private readonly logger = new Logger(ControllerPollsGuard.name);
  constructor(private readonly pasetoService: PasetoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    this.logger.debug(`Checking for auth token on request body`, request.body);

    const { access_token } = request.body;

    try {
      const payload = await this.pasetoService.verifyToken(access_token);
      request.pollID = payload.pollID
      request.userID = payload.userID
      request.name = payload.name
      return true;
    } catch {
      throw new ForbiddenException('Invalid authorization token');
    }
  }
}
