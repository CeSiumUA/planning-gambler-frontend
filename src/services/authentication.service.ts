import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {JoinRoomRequest, RoomRequest} from "../models/roomRrequest";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {RoomToken} from "../models/roomToken";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) { }

  public createRoom(createRoomRequest: RoomRequest): Observable<RoomToken>{
    let apiUrl: string = environment.apiUrl + '/api/rooms/create';
    return this.httpClient.post<RoomToken>(apiUrl, createRoomRequest);
  }
  public joinRoom(joinRoomRequest: JoinRoomRequest): Observable<RoomToken>{
    let apiUrl: string = environment.apiUrl + '/api/rooms/join';
    return this.httpClient.post<RoomToken>(apiUrl, joinRoomRequest);
  }
}
