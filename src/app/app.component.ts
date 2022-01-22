import { Component } from '@angular/core';
import {RemoteHubConnectorService} from "../services/remotehub.connector.service";
import {AuthenticationService} from "../services/authentication.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateComponent} from "./dialogs/create/create.component";
import {JoinComponent} from "./dialogs/join/join.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'planning-gambler-frontend';
  constructor(private matDialog: MatDialog) {
  }
  openCreateRoomDialog(){
    this.matDialog.open(CreateComponent);
  }
  openJoinRoomDialog(){
    this.matDialog.open(JoinComponent);
  }
}
