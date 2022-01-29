import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";
import {RoomRequest} from "../../../models/roomRrequest";
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  createForm: FormGroup = new FormGroup({
    "displayName": new FormControl("", Validators.required),
    "roomPassword": new FormControl("")
  });

  errorMessage: string|undefined;

  constructor(private authService: AuthenticationService, private matDialogRef: MatDialogRef<CreateComponent>, private router: Router) { }

  ngOnInit(): void {
  }

  createRoom(){
    let request: RoomRequest = {
      displayName: this.createForm.get('displayName')?.value,
      roomPassword: this.createForm.get('roomPassword')?.value
    }
    this.authService.createRoom(request)
      .subscribe(tokenResult => {
        localStorage.setItem('auth_token', JSON.stringify(tokenResult));
        this.router.navigateByUrl('/room').then(result => {
          if(result) {
            this.matDialogRef.close();
          }
        });

      });
  }
}
