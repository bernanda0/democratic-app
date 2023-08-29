import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PollsModule } from './polls/polls.module';
import { RedisModule } from './redis/redis.module';
import { PasetoModule } from './paseto/paseto.module';

@Module({
  imports: [ConfigModule.forRoot(), PollsModule, RedisModule, PasetoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
