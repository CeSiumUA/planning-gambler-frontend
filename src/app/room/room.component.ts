import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {RoomService} from "../../services/room.service";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {MatStepper} from "@angular/material/stepper";
import {Participant} from "../../models/participant";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  @ViewChild('stepper') stepper: MatStepper|undefined;
  constructor(public roomService: RoomService) {
    this.roomService.registerStepUpdate(() => {
      if (this.stepper !== undefined) {
        const stageIndex = this.roomService.stages.findIndex(l => l.id === this.roomService.currentStage?.id);
        if(stageIndex !== -1) {
          this.stepper.selectedIndex = stageIndex;
        }
      }
    });
  }

  createStage(title: string){
    this.roomService.createStage(title);
  }

  async updateStep(event: StepperSelectionEvent) {
    const res = this.roomService.selectStage(event.selectedIndex).valueOf();
    if(!res && this.stepper !== undefined){
      this.stepper.selectedIndex = event.previouslySelectedIndex;
    }
  }

  getImageSrc(participant: Participant): string{
    if(participant.isVoted === true && participant.voteResult === undefined){
      return `assets/numbers/voted.png`;
    }
    if(participant.isVoted === true && participant.voteResult !== undefined){
      return `assets/numbers/${participant.voteResult}.png`;
    }
    return '';
  }

  async ngOnInit(): Promise<void> {
    await this.roomService.fetchRoom().then(() => {
      if (this.stepper !== undefined) {
        const stageIndex = this.roomService.stages.findIndex(l => l.id === this.roomService.currentStage?.id);
        if(stageIndex !== -1) {
          this.stepper.selectedIndex = stageIndex;
        }
      }
    });
  }
}
