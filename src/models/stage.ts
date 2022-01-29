import {Vote} from "./vote";

export interface Stage{
  id: string,
  title: string,
  deadline: string|undefined,
  votes: Vote[]
}
