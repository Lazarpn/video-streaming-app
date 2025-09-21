import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { environment } from '../../environments/environment';
import { ButtonComponent } from '../shared/button/button.component';
import { InputComponent } from '../shared/components/input/input.component';
import { LS_USER_TOKEN } from '../shared/constants';
import { StreamType } from '../shared/enums/stream-type.enum';
import { ExceptionDetail } from '../shared/exception-detail';
import { PeerSignal, StreamTypeModel } from '../shared/models/stream';
import { AccountService } from '../shared/services/account.service';
import { NotificationService } from '../shared/services/notification.service';
import { SignalRService } from '../shared/services/signalr.service';
import { StreamService } from '../shared/services/stream.service';

@Component({
  selector: 'vs-stream',
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.scss',
  imports: [InputComponent, ButtonComponent, FormsModule]
})
export class StreamComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLVideoElement>;

  streamBasicInfo: StreamTypeModel;
  streamId: string;
  StreamTypeEnum = StreamType;

  isUnlocked: boolean = false;
  streamPassword: string = '';

  pc: RTCPeerConnection;
  localStream: MediaStream;
  remoteStream = new MediaStream();

  get currentUserId() {
    return this.accountService.user?.id;
  }

  get isBroadcaster() {
    return this.streamBasicInfo?.userOwnerId === this.currentUserId;
  }

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private streamService: StreamService,
    private notification: NotificationService,
    private signalRService: SignalRService
  ) { }

  ngOnInit(): void {
    this.signalRService.initialize();

    this.signalRService.userJoinedTheStream.subscribe(async userId => {
      if (this.isBroadcaster) {
        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);

        const signal: PeerSignal = {
          fromId: this.currentUserId!,
          toId: userId,  // must be viewer’s Guid
          message: { type: 'offer', sdp: { type: 'offer', sdp: offer.sdp ?? '' } }
        };

        this.streamService.createOffer(this.streamId, signal).subscribe();
      }
    });

    this.signalRService.userLeftTheStream.subscribe(userId => {
      console.log('User left the stream: ', userId);
    });

    this.route.data.subscribe(data => {
      this.streamBasicInfo = data.streamType;
      this.isUnlocked = this.streamBasicInfo.type === StreamType.Public || this.isBroadcaster;
    });

    this.route.params.subscribe(params => {
      const streamId = params['streamId'];
      this.streamId = streamId;

      window.addEventListener('beforeunload', _ => {
        const token = localStorage.getItem(LS_USER_TOKEN); // or however your app stores it

        const data = {};
        fetch(`${environment.apiUrl}/meets/${this.streamId}/leave`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          keepalive: true
        });
      });

      if (this.isUnlocked) {
        this.streamService.joinStream(this.streamId).subscribe({
          next: () => { },
          error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
        });
      }
    });
  }

  async ngAfterViewInit() {
    if (this.isBroadcaster) {
      // broadcaster
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.videoPlayer.nativeElement.srcObject = this.localStream;

      this.setupPeerConnection();
    } else {
      // viewer
      this.setupPeerConnection();
      this.videoPlayer.nativeElement.srcObject = this.remoteStream;
    }
  }

  ngOnDestroy(): void {
    this.streamService.leaveStream(this.streamId).subscribe({
      next: () => { },
      error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
    });

    this.pc?.close();
    this.localStream?.getTracks().forEach(track => track.stop());

    this.streamService.leaveStream(this.streamId).subscribe({
      next: () => { },
      error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
    });
  }

  private setupPeerConnection() {
    this.pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => this.pc.addTrack(track, this.localStream));
    }

    this.pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => this.remoteStream.addTrack(track));
    };

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        const signal: PeerSignal = {
          fromId: this.currentUserId!,   // must be Guid
          toId: this.isBroadcaster
            ? this.accountService.user.id // actual viewer Guid
            : this.streamBasicInfo.userOwnerId,
          message: {
            type: 'ice',
            candidate: {
              candidate: event.candidate.candidate,
              sdpMid: event.candidate.sdpMid ?? null,
              sdpMLineIndex: event.candidate.sdpMLineIndex ?? null,
              usernameFragment: event.candidate.usernameFragment ?? null
            }
          }
        };

        this.streamService.sendIceCandidate(this.streamId, signal).subscribe();
      }
    };

    this.signalRService.broadcasterCreatedOffer.subscribe(async (model: PeerSignal) => {
      await this.pc.setRemoteDescription({ type: model.message.sdp!.type, sdp: model.message.sdp!.sdp });
      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);

      const signal: PeerSignal = {
        fromId: this.currentUserId!,
        toId: model.fromId,
        message: { type: 'answer', sdp: { type: 'answer', sdp: answer.sdp ?? '' } }
      };

      this.streamService.respondToOffer(this.streamId, signal).subscribe({
        next: () => { },
        error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
      });
    });

    this.signalRService.viewerRespondedToAnOffer.subscribe(async (model: PeerSignal) => {
      await this.pc.setRemoteDescription({
        type: model.message.sdp!.type,
        sdp: model.message.sdp!.sdp
      });
    });

    this.signalRService.iceCandidateReceived.subscribe(async (model: PeerSignal) => {
      try {
        await this.pc.addIceCandidate(model.message.candidate);
      } catch {
        console.error('Error adding received ICE candidate');
      }
    });
  }

  unlockStream() {
    const model = { password: this.streamPassword };
    this.streamService.unlockStream(this.streamId, model).subscribe({
      next: () => {
        this.isUnlocked = true;

        this.streamService.joinStream(this.streamId).subscribe({
          next: () => { },
          error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
        });
      },
      error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
    });
  }

  private async handleErrors(errors: ExceptionDetail[]) {
    await this.notification.error({ exceptionDetail: errors[0] });
  }
}
