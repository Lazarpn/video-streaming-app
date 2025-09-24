import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { LS_USER_TOKEN } from '../shared/constants';
import { StreamType } from '../shared/enums/stream-type.enum';
import { ExceptionDetail } from '../shared/exception-detail';
import { PeerSignal, StreamTypeModel } from '../shared/models/stream';
import { AccountService } from '../shared/services/account.service';
import { NotificationService } from '../shared/services/notification.service';
import { SignalRService } from '../shared/services/signalr.service';
import { StreamService } from '../shared/services/stream.service';
import { StreamControlsComponent, StreamControlsStatus } from './stream-controls/stream-controls.component';

@Component({
  selector: 'vs-stream',
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.scss',
  imports: [FormsModule, StreamControlsComponent]
})
export class StreamComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer: ElementRef<HTMLVideoElement>;

  streamBasicInfo: StreamTypeModel;
  streamId: string;
  StreamTypeEnum = StreamType;

  streamPassword: string = '';

  pc: RTCPeerConnection;
  localStream: MediaStream;
  remoteStream = new MediaStream();

  streamControls: StreamControlsStatus = { camera: true, microphone: true };

  get currentUserId() {
    return this.accountService.user?.id;
  }

  get isBroadcaster() {
    return this.streamBasicInfo?.userOwnerId === this.currentUserId;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    public streamService: StreamService,
    private notification: NotificationService,
    private signalRService: SignalRService
  ) { }

  ngOnInit(): void {
    this.signalRService.initialize();
    this.streamControls = this.streamService.streamControls;

    this.signalRService.userJoinedTheStream.subscribe(async userId => {
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      const signal: PeerSignal = {
        fromId: this.currentUserId,
        toId: userId,
        message: { type: 'offer', sdp: { type: 'offer', sdp: offer.sdp ?? '' } }
      };

      this.streamService.createOffer(this.streamId, signal).subscribe({
        next: () => { },
        error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
      });
    });

    this.signalRService.userLeftTheStream.subscribe(userId => {
      if (userId === this.streamBasicInfo.userOwnerId) {
        this.router.navigate(['/home']);
      }
    });

    this.route.data.subscribe(data => {
      this.streamBasicInfo = data.streamType;
    });

    this.route.params.subscribe(params => {
      const streamId = params['streamId'];
      this.streamId = streamId;

      this.leaveStreamBeforeUnload();
      this.joinStream();
    });
  }

  async ngAfterViewInit() {
    if (this.isBroadcaster) {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      this.onControlsChange(this.streamControls);

      this.videoPlayer.nativeElement.srcObject = this.localStream;

      this.setupPeerConnection();
    } else {
      this.setupPeerConnection();
      this.videoPlayer.nativeElement.srcObject = this.remoteStream;
    }
  }

  ngOnDestroy(): void {
    this.leaveStream();
    this.pc?.close();
    this.localStream?.getTracks().forEach(track => track.stop());
  }

  endStream() {
    this.leaveStream();
  }

  onControlsChange(controls: StreamControlsStatus) {
    this.streamControls = controls;

    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = controls.camera;
      });

      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = controls.microphone;
      });
    }
  }

  private setupPeerConnection() {
    this.pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => this.pc.addTrack(track, this.localStream));
    }

    this.pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => this.remoteStream.addTrack(track));
      this.videoPlayer.nativeElement.play().catch(e => console.warn('Autoplay blocked', e));
    };

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        const signal: PeerSignal = {
          fromId: this.currentUserId,
          toId: this.isBroadcaster
            ? this.currentUserId! // backend ignores this and fans out to all viewers
            : this.streamBasicInfo.userOwnerId, // send directly to broadcaster
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

        this.streamService.sendIceCandidate(this.streamId, signal).subscribe({
          next: () => { },
          error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
        });
      }
    };

    this.signalRService.broadcasterCreatedOffer.subscribe(async (model: PeerSignal) => {
      await this.pc.setRemoteDescription({ type: model.message.sdp.type, sdp: model.message.sdp.sdp });
      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);

      const signal: PeerSignal = {
        fromId: this.currentUserId,
        toId: this.streamBasicInfo.userOwnerId,
        message: { type: 'answer', sdp: { type: 'answer', sdp: answer.sdp ?? '' } }
      };

      this.streamService.respondToOffer(this.streamId, signal).subscribe({
        next: () => { },
        error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
      });
    });

    this.signalRService.viewerRespondedToAnOffer.subscribe(async (model: PeerSignal) => {
      if (this.isBroadcaster) {
        if (this.pc.signalingState === 'have-local-offer') {
          console.log('[Broadcaster] Applying viewer answer...');
          await this.pc.setRemoteDescription(model.message.sdp);
        } else {
          console.warn('[Broadcaster] Ignoring unexpected answer, state =', this.pc.signalingState);
        }
      }
    });

    this.signalRService.iceCandidateReceived.subscribe(async (model: PeerSignal) => {
      try {
        await this.pc.addIceCandidate(model.message.candidate);
      } catch {
        console.error('Error adding received ICE candidate');
      }
    });
  }

  private leaveStreamBeforeUnload() {
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
  }

  private leaveStream() {
    this.streamService.leaveStream(this.streamId).subscribe({
      next: () => this.router.navigate(['/home']),
      error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
    });
  }

  private joinStream() {
    this.streamService.joinStream(this.streamId, false).subscribe({
      next: () => { },
      error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
    });
  }

  private async handleErrors(errors: ExceptionDetail[]) {
    await this.notification.error({ exceptionDetail: errors[0] });
  }
}
