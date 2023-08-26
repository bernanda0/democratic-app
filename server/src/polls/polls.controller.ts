import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './polls.dto';
import { PollsService } from './polls.service';

@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService){};

  @Post()
  async create(@Body() createPollDto: CreatePollDto) {
    Logger.log('Creating poll');
    const result = await this.pollsService.createPoll(createPollDto);
    return result;
  }

  @Post('/join')
  async join(@Body() joinPollDto: JoinPollDto) {
    Logger.log('Joining poll');
    const result = await this.pollsService.joinPoll(joinPollDto);
    return result;
  }

  @Post('/rejoin')
  async rejoin() {
    const result = await this.pollsService.rejoinPoll({
      name: 'will be using jwt/paseto',
      pollID: 'will be using jwt/paseto',
      userID: 'will be using jwt/paseto',
    });

    return result;
  }
}
