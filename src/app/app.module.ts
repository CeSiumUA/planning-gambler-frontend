import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {HttpClientModule} from "@angular/common/http";
import { CreateComponent } from './dialogs/create/create.component';
import { JoinComponent } from './dialogs/join/join.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RoomComponent } from './room/room.component';
import {RouterModule, Routes} from "@angular/router";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {RoomGuard} from "../services/room.guard";
import {MatStepperModule} from "@angular/material/stepper";

const routes: Routes = [
  {
    path: 'room', component: RoomComponent, canActivate: [RoomGuard]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    CreateComponent,
    JoinComponent,
    RoomComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        RouterModule.forRoot(routes),
        MatStepperModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
