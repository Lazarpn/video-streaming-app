import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

import { Subject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LS_USER_TOKEN, SS_SOCKET_CONNECTION_ID } from '../constants';
import { PeerSignal } from '../models/stream';
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class SignalRService {

  connectionChange = new Subject<boolean>();

  userJoinedTheStream = new Subject<string>();
  userLeftTheStream = new Subject<string>();
  broadcasterCreatedOffer = new Subject<PeerSignal>();
  viewerRespondedToAnOffer = new Subject<PeerSignal>();
  iceCandidateReceived = new Subject<PeerSignal>();

  private connection: signalR.HubConnection | null = null;
  private failedReconnectAttempts = 0;

  constructor(private accountService: AccountService) { }

  initialize() {
    if (this.accountService.authenticated() && !this.connection) {
      this.connect();
    }
  }

  ensureSignalRIsConnected() {
    console.log('[SignalR] Checking connection state...');
    if (!this.accountService.authenticated() || !this.connection || this.connection.state !== signalR.HubConnectionState.Disconnected) {
      return;
    }

    console.log('[SignalR] Reconnecting...');
    this.connection.start();
  }

  isDisconnected() {
    return this.connection?.state === signalR.HubConnectionState.Disconnected;
  }

  private connect() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiBaseUrl}/hubs/notifications`, { accessTokenFactory: () => localStorage.getItem(LS_USER_TOKEN) })
      .withAutomaticReconnect([0, 0, 2000, 2000, 2000, 4000, 4000, 8000, 8000])
      .build();

    this.connection.on('userJoinedTheStream', (userId: string) => {
      this.userJoinedTheStream.next(userId);
    });

    this.connection.on('userLeftTheStream', (userId: string) => {
      this.userLeftTheStream.next(userId);
    });

    this.connection.on('broadcasterCreatedOffer', (model: PeerSignal) => {
      this.broadcasterCreatedOffer.next(model);
    });

    this.connection.on('viewerRespondedToAnOffer', (model: PeerSignal) => {
      this.viewerRespondedToAnOffer.next(model);
    });

    this.connection.on('iceCandidateReceived', (model: PeerSignal) => {
      this.iceCandidateReceived.next(model);
    });

    this.connection.start().then(() => {
      console.log('[SignalR] start() connected successfully');
      this.storeSocketConnectionId();
      this.connectionChange.next(true);
      this.failedReconnectAttempts = 0;
    }).catch(error => {
      console.error('[SignalR] start() caught: ', error.toString());
      this.waitAndAttemptToReconnect();
    });

    this.connection.onclose(error => {
      console.log('[SignalR] onclose handler called. ', error?.toString());

      if (this.connection && this.connection.state === signalR.HubConnectionState.Disconnected) {
        this.connectionChange.next(false);
        this.waitAndAttemptToReconnect();
      }
    });

    this.connection.onreconnected(() => {
      this.storeSocketConnectionId();
    });
  }

  private waitAndAttemptToReconnect() {
    if (this.failedReconnectAttempts === 3) {
      this.failedReconnectAttempts = 0;
      return;
    }

    this.failedReconnectAttempts++;
    setTimeout(() => this.ensureSignalRIsConnected(), 1000);
  }

  private storeSocketConnectionId() {
    sessionStorage.setItem(SS_SOCKET_CONNECTION_ID, this.connection?.connectionId as string);
  }
}
