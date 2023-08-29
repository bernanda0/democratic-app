// paseto.service.ts
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { TokenPayload } from 'src/polls/polls.type';
const { V3 } = require('paseto');

@Injectable()
export class PasetoService {
  private readonly secretKey: Buffer = generateSymmetricKey();

  async createToken(payload: TokenPayload): Promise<string> {
    return await V3.encrypt(payload, this.secretKey);
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    return await V3.decrypt(token, this.secretKey);
  }
}

const generateSymmetricKey = (): Buffer => {
  return crypto.randomBytes(32); // 32 bytes = 256 bits
};

