import { Injectable, Logger } from '@nestjs/common';
import { createPollID, createUserID } from 'src/utils/id';
import {
  CreatePollFields,
  JoinPollFields,
  RejoinPollFields,
} from './polls.type';
import { PollsRepository } from './polls.repository';

@Injectable()
export class PollsService {
  private readonly logger = new Logger(PollsService.name);
  constructor(private readonly pollsRepository: PollsRepository) {}

  async createPoll(fields: CreatePollFields) {
    const pollID = createPollID();
    const userID = createUserID();

    const createdPoll = await this.pollsRepository.createPoll({
      pollID,
      userID,
      ...fields,
    });

    // TODO - create an access token of pollID and userID
    return {
      poll: createdPoll,
      // access token
    };
  }

  async joinPoll(fields: JoinPollFields) {
    const userID = createUserID();

    // this.logger.debug(
    //   `Fetching poll with ID: ${fields.pollID} for user with ID: ${userID}`,
    // );
    // const joinedPoll = await this.pollsRepository.getPoll(fields.pollID);

    this.logger.debug(
      `Joiining poll with ID: ${fields.pollID} for user with ID: ${userID} with name: ${fields.name}`,
    );

    const joinedPoll = await this.pollsRepository.addParticipant({
        pollID: fields.pollID,
        userID: userID,
        name: fields.name,
    });

    return {
      poll: joinedPoll,
      // access token,
    };
  }

  async rejoinPoll(fields: RejoinPollFields) {
    this.logger.debug(
      `Rejoining poll with ID: ${fields.pollID} for user with ID: ${fields.userID} with name: ${fields.name}`,
    );

    const joinedPoll = await this.pollsRepository.addParticipant(fields);

    return joinedPoll;
  }
}
