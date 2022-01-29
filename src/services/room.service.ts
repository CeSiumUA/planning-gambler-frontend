import { Injectable } from '@angular/core';
import {Participant} from "../models/participant";
import {NewStageResult} from "../models/newStageResult";
import {HiddenVotingResult, VotingResult} from "../models/vote";
import {RemoteHubConnectorService} from "./remotehub.connector.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Stage} from "../models/stage";
import {RoomToken} from "../models/roomToken";

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  public stages: Stage[] = [];
  /*public get planningStages(): Stage[]{
    return this.stages;
  }*/
  private get roomClaims(): RoomToken{
    return JSON.parse(localStorage.getItem('auth_token')??'');
  }
  public participants: Participant[] = [];
  public currentStage: Stage|undefined;
  public roomId: string|undefined;
  constructor(private hubConnectionService: RemoteHubConnectorService, private snackBar: MatSnackBar) {
    this.registerHandlers();
  }

  public fetchRoom(): Promise<void>{
    return this.hubConnectionService.fetchRoom().then(result => {
      this.stages = result.stages;
      this.participants = result.participants;
      this.currentStage = result.currentStage;
      this.roomId = result.roomId;
    });
  }

  public selectStage(stageNumber: number): boolean | Promise<boolean>{
    if(this.roomClaims.memberType != 0){
      return false;
    }
    return this.hubConnectionService.selectStage(this.stages[stageNumber].id).then(() => true, () => false);
  }

  public createStage(title: string, deadline: string|undefined = undefined){
    this.hubConnectionService.createStage(title, deadline).then(() => {
      this.showSnackbarMessage(`Stage ${title} created`);
    });
  }

  public add(participant: Participant): void{
    let alreadyContains = this.participants.some(value => {
      return value.id === participant.id && value.displayName === participant.displayName;
    })
    if(!alreadyContains){
      this.participants.push(participant)
    }
  }
  public remove(participant: Participant): void{
    let foundParticipants = this.participants.filter(p => p.id == participant.id && p.displayName == participant.displayName);
    if(foundParticipants.length === 1){
      let participantIndex = this.participants.indexOf(foundParticipants[0]);
      this.participants = this.participants.splice(participantIndex, 1);
    }
  }
  public handleStageCreated(newStage: NewStageResult): void{
    const stage: Stage = {
      title: newStage.title,
      id: newStage.id,
      deadline: newStage.deadline,
      votes: []
    }
    this.stages.push(stage);
  }
  public handleStageSelected(stageId: string){
    this.currentStage = this.stages.filter(l => l.id === stageId)[0];
  }
  public handleCountDown(i: number){

  }
  public handleStageVotingResult(votingResults: VotingResult[]){

  }
  public handleParticipantVoted(hiddenVotingResult: HiddenVotingResult){

  }
  public registerStepUpdate(updater: any){
    updater();
  }
  private registerHandlers(){
    this.hubConnectionService.connectionInstance.on('ParticipantConnected', (participant: Participant) => {
      this.add(participant);
      this.showSnackbarMessage(`${participant.displayName} has joined the room`);
    });
    this.hubConnectionService.connectionInstance.on('ParticipantDisconnected', (participant: Participant) => {
      this.remove(participant);
      this.showSnackbarMessage(`${participant.displayName} has left the room`);
    });
    this.hubConnectionService.connectionInstance.on('StageCreated', (stageCreated: NewStageResult) => {
      this.handleStageCreated(stageCreated);
    });
    this.hubConnectionService.connectionInstance.on('StageSelected', this.handleStageSelected);
    this.hubConnectionService.connectionInstance.on('CountDown', this.handleCountDown);
    this.hubConnectionService.connectionInstance.on('StageVotingResult', this.handleStageVotingResult);
    this.hubConnectionService.connectionInstance.on('ParticipantVoted', this.handleParticipantVoted);
  }

  private showSnackbarMessage(text: string){
    this.snackBar.open(text, undefined, {
      duration: 2000
    })
  }
}
