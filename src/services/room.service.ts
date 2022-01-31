import { Injectable } from '@angular/core';
import {Participant, ParticipantsChange} from "../models/participant";
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
  private stepUpdater: any;
  private static get roomClaims(): RoomToken{
    return JSON.parse(localStorage.getItem('auth_token')??'');
  }
  public participants: Participant[] = [];
  public currentStage: Stage|undefined;
  public roomId: string|undefined;
  constructor(private hubConnectionService: RemoteHubConnectorService, private snackBar: MatSnackBar) {
    this.registerHandlers();
    let tokenInfo: RoomToken = RoomService.roomClaims;
    let currentParticipant: Participant = {
      displayName: tokenInfo.displayName,
      id: tokenInfo.userId,
      memberType: tokenInfo.memberType
    }
  }

  public async fetchRoom(): Promise<void>{
    return this.hubConnectionService.fetchRoom().then(result => {
      this.stages = result.stages;
      this.participants = result.participants;
      this.currentStage = result.currentStage;
      this.roomId = result.roomId;
    });
  }

  public selectStage(stageNumber: number): boolean | Promise<boolean>{
    if(RoomService.roomClaims.memberType != 0){
      return false;
    }
    return this.hubConnectionService.selectStage(this.stages[stageNumber].id).then(() => true, () => false);
  }

  public createStage(title: string, deadline: string|undefined = undefined){
    this.hubConnectionService.createStage(title, deadline).then(() => {
      this.showSnackbarMessage(`Stage ${title} created`);
    });
  }

  public add(participantsChange: ParticipantsChange): void{
    this.participants = participantsChange.participants;
  }
  public remove(participantsChange: ParticipantsChange): void{
    this.participants = participantsChange.participants;
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
    this.stepUpdater();
  }
  public handleCountDown(i: number){

  }
  public handleStageVotingResult(votingResults: VotingResult[]){

  }
  public handleParticipantVoted(hiddenVotingResult: HiddenVotingResult){
    let filtered = this.participants.filter(x => x.id === hiddenVotingResult.userId);
    if(filtered.length === 1){
      filtered[0].isVoted = true;
    }
  }
  public registerStepUpdate(updater: any){
    this.stepUpdater = updater;
  }
  private registerHandlers(){
    this.hubConnectionService.connectionInstance.on('ParticipantConnected', (participantsChange: ParticipantsChange) => {
      this.add(participantsChange);
      this.showSnackbarMessage(`${participantsChange.affectedParticipant.displayName} has joined the room`);
    });
    this.hubConnectionService.connectionInstance.on('ParticipantDisconnected', (participantsChange: ParticipantsChange) => {
      this.remove(participantsChange);
      this.showSnackbarMessage(`${participantsChange.affectedParticipant.displayName} has left the room`);
    });
    this.hubConnectionService.connectionInstance.on('StageCreated', (stageCreated: NewStageResult) => {
      this.handleStageCreated(stageCreated);
    });
    this.hubConnectionService.connectionInstance.on('StageSelected', (stageId: string) => {
      this.handleStageSelected(stageId);
    });
    this.hubConnectionService.connectionInstance.on('CountDown', this.handleCountDown);
    this.hubConnectionService.connectionInstance.on('StageVotingResult', this.handleStageVotingResult);
    this.hubConnectionService.connectionInstance.on('ParticipantVoted', (result: HiddenVotingResult) => {
      this.handleParticipantVoted(result);
    });
  }

  private showSnackbarMessage(text: string){
    this.snackBar.open(text, undefined, {
      duration: 2000
    })
  }
}
