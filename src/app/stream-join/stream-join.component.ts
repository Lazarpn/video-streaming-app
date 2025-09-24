import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonComponent } from '../shared/button/button.component';
import { InputComponent } from '../shared/components/input/input.component';
import { StreamType } from '../shared/enums/stream-type.enum';
import { ExceptionDetail } from '../shared/exception-detail';
import { StreamTypeModel } from '../shared/models/stream';
import { AccountService } from '../shared/services/account.service';
import { NotificationService } from '../shared/services/notification.service';
import { StreamService } from '../shared/services/stream.service';
import { StreamControlsComponent, StreamControlsStatus } from '../stream/stream-controls/stream-controls.component';

@Component({
  selector: 'vs-stream-join',
  imports: [InputComponent, ButtonComponent, FormsModule, StreamControlsComponent],
  templateUrl: './stream-join.component.html',
  styleUrl: './stream-join.component.scss'
})
export class StreamJoinComponent implements OnInit {
  streamId: string;
  streamBasicInfo: StreamTypeModel;

  isUnlocked: boolean = false;

  pc: RTCPeerConnection;
  localStream: MediaStream;
  remoteStream = new MediaStream();

  streamControls: StreamControlsStatus = { camera: true, microphone: false };

  get currentUserId() {
    return this.accountService.user?.id;
  }

  get isBroadcaster() {
    return this.streamBasicInfo?.userOwnerId === this.currentUserId;
  }

  constructor(
    private router: Router,
    public streamService: StreamService,
    private route: ActivatedRoute,
    private notification: NotificationService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.streamBasicInfo = data.streamType;
      this.isUnlocked = this.streamBasicInfo.type === StreamType.Public || this.isBroadcaster;
    });

    this.route.params.subscribe(params => {
      const streamId = params['streamId'];
      this.streamId = streamId;
    });
  }

  onControlsChange(controls: StreamControlsStatus) {
    this.streamControls = controls;
  }

  joinStream() {
    this.streamService.streamControls = this.streamControls;

    this.streamService.joinStream(this.streamId).subscribe({
      next: () => {
        this.router.navigate([`/stream/${this.streamId}`]);
      },
      error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
    });
  }

  private async handleErrors(errors: ExceptionDetail[]) {
    await this.notification.error({ exceptionDetail: errors[0] });
  }
}
