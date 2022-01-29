import {Participant} from "./participant";

export interface Vote{
  voter: Participant,
  vote: number
}

export interface VotingResult{
  userId: string,
  stageId: string,
  vote: number
}

export interface HiddenVotingResult{
  stageId: string,
  userId: string
}

export const voteOptions: number[] = [
  1,
  2,
  3,
  5,
  8,
  13,
  21,
  34,
  55,
  89
]
