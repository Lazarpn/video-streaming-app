import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonComponent } from 'src/app/shared/button/button.component';

import { AccountService } from '../../shared/services/account.service';

export interface StreamControlsStatus {
  camera: boolean;
  microphone: boolean;
}

@Component({
  selector: 'vs-stream-controls',
  imports: [ButtonComponent],
  templateUrl: './stream-controls.component.html',
  styleUrl: './stream-controls.component.scss'
})
export class StreamControlsComponent {
  @Input() streamId: string;
  @Input() isBeforeStreamJoin: boolean = false;
  @Input() streamControls: StreamControlsStatus = { camera: true, microphone: false };

  @Output() endStream = new EventEmitter<void>();
  @Output() controlsChange = new EventEmitter<StreamControlsStatus>();

  get userInitials() {
    return `${this.accountService.user.firstName} ${this.accountService.user.lastName}`;
  }

  get currentTime() {
    const currentDate = new Date();
    return `${currentDate.getHours()}:${currentDate.getMinutes() < 10 ? '0' : ''}${currentDate.getMinutes()}`;
  }

  constructor(private accountService: AccountService) { }

  toggleCamera() {
    this.streamControls.camera = !this.streamControls.camera;
    this.controlsChange.emit(this.streamControls);
  }

  toggleMicrophone() {
    this.streamControls.microphone = !this.streamControls.microphone;
    this.controlsChange.emit(this.streamControls);
  }
}
