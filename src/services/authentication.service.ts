import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {JoinRoomRequest, RoomRequest} from "../models/roomRrequest";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {RoomToken} from "../models/roomToken";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private static get tokenDetails(): RoomToken{
    return JSON.parse(localStorage.getItem('auth_token')??'');
  }
  constructor(private httpClient: HttpClient) { }

  public createRoom(createRoomRequest: RoomRequest): Observable<RoomToken>{
    let apiUrl: string = environment.apiUrl + '/api/rooms/create';
    return this.httpClient.post<RoomToken>(apiUrl, createRoomRequest);
  }
  public joinRoom(joinRoomRequest: JoinRoomRequest): Observable<RoomToken>{
    let apiUrl: string = environment.apiUrl + '/api/rooms/join';
    return this.httpClient.post<RoomToken>(apiUrl, joinRoomRequest);
  }
  public verify(): Observable<any>{
    let apiUrl: string = environment.apiUrl + '/api/rooms/verify';
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${AuthenticationService.tokenDetails.token}`)
    return this.httpClient.get(apiUrl, {
      headers: headers
    });
  }
}
