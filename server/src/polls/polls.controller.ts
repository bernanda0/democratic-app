import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { CreatePollDto, JoinPollDto } from './polls.dto';
import { PollsService } from './polls.service';
import { ControllerPollsGuard } from './polls.guard';
import { RequestWithAuth } from './polls.type';

@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

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

  @UseGuards(ControllerPollsGuard)
  @Post('/rejoin')
  async rejoin(@Req() request: RequestWithAuth) {
    const { pollID, userID, name } = request;
    const result = await this.pollsService.rejoinPoll({
      pollID: pollID,
      userID: userID,
      name: name
    });

    return result;
  }
}
