import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { createNominationID, createPollID, createUserID } from 'src/utils/id';
import {
  AddNominationFields,
  AddParticipantData,
  CreatePollFields,
  JoinPollFields,
  Poll,
  RejoinPollFields,
  SubmitRankingsFields,
} from './polls.type';
import { PollsRepository } from './polls.repository';
import { PasetoService } from 'src/paseto/paseto.service';
import { log } from 'console';

@Injectable()
export class PollsService {
  private readonly logger = new Logger(PollsService.name);
  constructor(
    private readonly pollsRepository: PollsRepository,
    private readonly pasetoService: PasetoService,
  ) {}

  async createPoll(fields: CreatePollFields) {
    const pollID = createPollID();
    const userID = createUserID();

    const createdPoll = await this.pollsRepository.createPoll({
      pollID,
      userID,
      ...fields,
    });

    const access_token = await this.pasetoService.createToken({
      pollID: pollID,
      userID: userID,
      name: fields.name,
    });

    return {
      poll: createdPoll,
      access_token: access_token,
    };
  }

  async joinPoll(fields: JoinPollFields) {
    const userID = createUserID();

    this.logger.debug(
      `Fetching poll with ID: ${fields.pollID} for user with ID: ${userID}`,
    );
    const joinedPoll = await this.pollsRepository.getPoll(fields.pollID);

    this.logger.debug(
      `Joiining poll with ID: ${fields.pollID} for user with ID: ${userID} with name: ${fields.name}`,
    );

    const access_token = await this.pasetoService.createToken({
      pollID: joinedPoll.id,
      userID: userID,
      name: fields.name,
    });

    return {
      poll: joinedPoll,
      access_token: access_token,
    };
  }

  async rejoinPoll(fields: RejoinPollFields) {
    this.logger.debug(
      `Rejoining poll with ID: ${fields.pollID} for user with ID: ${fields.userID} with name: ${fields.name}`,
    );

    const joinedPoll = await this.pollsRepository.addParticipant(fields);

    return joinedPoll;
  }

  async addParticipant(addParticipant: AddParticipantData): Promise<Poll> {
    return this.pollsRepository.addParticipant(addParticipant);
  }

  async removeParticipant(
    pollID: string,
    userID: string,
  ): Promise<Poll | void> {
    const poll = await this.getPoll(pollID);
    if (!poll.hasStarted) {
      const updatedPoll = await this.pollsRepository.removeParticipant(
        pollID,
        userID,
      );
      this.logger.log('Success removing participant with id ', userID);
      return updatedPoll;
    }
  }

  async getPoll(pollID: string): Promise<Poll> {
    return this.pollsRepository.getPoll(pollID);
  }

  async addNomination({
    pollID,
    userID,
    text,
  }: AddNominationFields): Promise<Poll> {
    return this.pollsRepository.addNomination({
      pollID,
      nominationID: createNominationID(),
      nomination: {
        userID,
        text,
      },
    });
  }

  async removeNomination(pollID: string, nominationID: string): Promise<Poll> {
    return this.pollsRepository.removeNomination(pollID, nominationID);
  }

  async startPoll(pollID: string): Promise<Poll> {
    return this.pollsRepository.startPoll(pollID);
  }

  async submitRankings(rankingsData: SubmitRankingsFields): Promise<Poll> {
    const poll = await this.pollsRepository.getPoll(rankingsData.pollID);

    if (!poll.hasStarted) {
      throw new BadRequestException(
        'Participants cannot rank until the poll has started.',
      );
    }

    return this.pollsRepository.addParticipantRankings(rankingsData);
  }
}
