import { Request } from "express";
import { Socket } from "socket.io";

export type CreatePollFields = {
  topic: string;
  votesPerVoter: number;
  name: string;
};

export type JoinPollFields = {
  pollID: string;
  name: string;
};

export type RejoinPollFields = {
  pollID: string;
  userID: string;
  name: string;
};

export type AddNominationFields = {
  pollID: string;
  userID: string;
  text: string;
};

export type SubmitRankingsFields = {
  pollID: string;
  userID: string;
  rankings: string[];
};

// repository types
export type CreatePollData = {
  pollID: string;
  topic: string;
  votesPerVoter: number;
  userID: string;
};

export type AddParticipantData = {
  pollID: string;
  userID: string;
  name: string;
};

export interface RemoveParticipantData {
  pollID: string;
  userID: string;
}

export type AddNominationData = {
  pollID: string;
  nominationID: string;
  nomination: Nomination;
};

export type AddParticipantRankingsData = {
  pollID: string;
  userID: string;
  rankings: string[];
};

export type TokenPayload = {
  pollID: string;
  userID: string;
  name: string;
}

export type RequestWithAuth = Request & TokenPayload
export type SocketWithAuth = Socket & TokenPayload;

export interface Participants {
    [participantID: string]: string;
}

export type Nomination = {
  userID: string;
  text: string;
}

export type Nominations = {
  [nominationID: string]: Nomination;
}

type NominationID = string;

export type Rankings = {
  [userID: string]: NominationID[];
};

export type Poll = {
  id: string;
  topic: string;
  votesPerVoter: number;
  participants: Participants;
  adminID: string;
  nominations: Nominations;
  rankings: Rankings;
  // results: Results;
  hasStarted: boolean;
}