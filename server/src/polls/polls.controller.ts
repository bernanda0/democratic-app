import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './polls.dto';

@Controller('polls')
export class PollsController {
  @Post()
  async create(@Body() createPollDto: CreatePollDto) {
    Logger.log('Creating poll');
    return createPollDto;
  }

  @Post('/join')
  async join(@Body() joinPollDto: JoinPollDto) {
    Logger.log('Joining a poll');

    return joinPollDto;
  }

  @Post('/rejoin')
  async rejoin() {
    Logger.log('Rejoining a poll');
  }
}
