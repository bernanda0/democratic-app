import { Injectable } from '@nestjs/common';
import { createPollID, createUserID } from 'src/utils/id';
import {
  CreatePollFields,
  JoinPollFields,
  RejoinPollFields,
} from './polls.type';

@Injectable()
export class PollsService {
  async createPoll(fields: CreatePollFields) {
    const pollID = createPollID();
    const userID = createUserID();

    return {
      pollID,
      userID,
      ...fields,
    };
  }

  async joinPoll(fields: JoinPollFields) {
    const userID = createUserID();

    return {
      ...fields,
      userID,
    };
  }

  async rejoinPoll(fields: RejoinPollFields) {
    return fields;
  }
}
