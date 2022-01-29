import {Injectable, Provider} from '@angular/core';
import { environment } from "../environments/environment";
import {HubConnection} from "@microsoft/signalr";
import * as signalR from '@microsoft/signalr';
import {RoomToken} from "../models/roomToken";
import {RoomInfo} from "../models/roomInfo";
import {CreateStageRequest} from "../models/createStageRequest";

@Injectable({
  providedIn: 'root'
})
export class RemoteHubConnectorService {

  private connection = new signalR.HubConnectionBuilder()
    .withUrl(`${environment.apiUrl}/planninghub`, {accessTokenFactory: () => {
      let rawToken = localStorage.getItem('auth_token');
      if(rawToken) {
        let roomToken: RoomToken = JSON.parse(rawToken);
        return roomToken.token;
      }
      return Promise.reject('Token not found!');
    }})
    .build();
  private connectionPromise = this.connection.start();

  get connectionInstance(): HubConnection{
    return this.connection;
  }

  constructor() {
  }

  public fetchRoom(): Promise<RoomInfo>{
    return this.connectionPromise.then(() => this.connection.invoke<RoomInfo>("FetchRoom"));
  }

  public vote(voteValue: number): Promise<void>{
    return this.connectionPromise.then(() => this.connection.invoke("Vote", voteValue))
  }

  public createStage(title: string, deadline: string|undefined): Promise<void>{
    let request: CreateStageRequest = {
      title: title,
      deadline: deadline
    }
    return this.connectionPromise.then(() => this.connection.invoke("CreateStage", request))
  }

  public selectStage(stageId: string): Promise<void> {
    return this.connectionPromise.then(() => this.connection.invoke("SelectStage", stageId));
  }

  public startCountdown(): Promise<void>{
    return this.connectionPromise.then(() => this.connection.invoke("StartCountDown"));
  }
}
