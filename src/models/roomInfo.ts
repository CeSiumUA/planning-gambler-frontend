import {Participant} from "./participant";
import {Stage} from "./stage";

export interface RoomInfo{
  roomId: string,
  participants: Participant[],
  stages: Stage[]
  currentStage: Stage|undefined
}
