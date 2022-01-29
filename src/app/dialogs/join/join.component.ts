import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {JoinRoomRequest} from "../../../models/roomRrequest";
import {Router} from "@angular/router";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {

  joinForm: FormGroup = new FormGroup({
    "displayName": new FormControl('', Validators.required),
    "roomId": new FormControl('',[Validators.required, Validators.pattern('^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$')]),
    "roomPassword": new FormControl('')
  })

  errorMessage: string|undefined;

  constructor(private authService: AuthenticationService, private matDialogRef: MatDialogRef<JoinComponent>, private router: Router) { }

  ngOnInit(): void {
  }
  joinRoom(){
    let joinRoomRequest: JoinRoomRequest = {
      displayName: this.joinForm.get('displayName')?.value,
      roomId: this.joinForm.get('roomId')?.value,
      roomPassword: this.joinForm.get('roomPassword')?.value
    }
    this.authService.joinRoom(joinRoomRequest)
      .subscribe(tokenResult => {
        localStorage.setItem('auth_token', JSON.stringify(tokenResult));
        this.router.navigateByUrl('/room').then(result => {
          if(result) {
            this.matDialogRef.close();
          }
        });
      }, error => {
        this.errorMessage = error
      });
  }
}
