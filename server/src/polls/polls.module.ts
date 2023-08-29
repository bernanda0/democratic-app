import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { redisModule } from 'src/redis/redis.module.config';
import { PollsRepository } from './polls.repository';
import { PasetoModule } from 'src/paseto/paseto.module';
import { PasetoService } from 'src/paseto/paseto.service';

@Module({
    imports: [ConfigModule, redisModule, PasetoModule],
    controllers: [PollsController],
    providers: [PollsService, PollsRepository]
})
export class PollsModule {}
