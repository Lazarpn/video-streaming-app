import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { StreamControlsStatus } from '../../stream/stream-controls/stream-controls.component';
import { PeerSignal, StreamCreateModel, StreamMember, StreamModel, StreamTypeModel, StreamUnlockModel } from '../models/stream';

@Injectable({ providedIn: 'root' })
export class StreamService {
  streamMembers: StreamMember[] = [];
  streamControls: StreamControlsStatus;
  streamPassword: string = '';

  private readonly API_ENDPOINT = `${environment.apiUrl}/meets`;

  constructor(private http: HttpClient) { }

  createStream(model: StreamCreateModel): Observable<StreamModel> {
    return this.http.post<StreamModel>(this.API_ENDPOINT, model);
  }

  sendIceCandidate(streamId: string, signal: PeerSignal): Observable<void> {
    return this.http.post<void>(`${this.API_ENDPOINT}/${streamId}/ice`, signal);
  }

  joinStream(id: string, makeMember: boolean = true): Observable<void> {
    return this.http.post<void>(`${this.API_ENDPOINT}/${id}/join`, { makeMember: makeMember, password: this.streamPassword });
  }

  getMeetMember(id: string): Observable<StreamMember> {
    return this.http.get<StreamMember>(`${this.API_ENDPOINT}/${id}/member`);
  }

  leaveStream(id: string): Observable<void> {
    return this.http.post<void>(`${this.API_ENDPOINT}/${id}/leave`, {}).pipe(tap(() => this.streamMembers = []));
  }

  getStreamType(id: string): Observable<StreamTypeModel> {
    return this.http.get<StreamTypeModel>(`${this.API_ENDPOINT}/types/${id}`);
  }

  createOffer(streamId: string, offer: PeerSignal): Observable<void> {
    return this.http.post<void>(`${this.API_ENDPOINT}/${streamId}/create-an-offer`, offer);
  }

  respondToOffer(streamId: string, answer: PeerSignal): Observable<void> {
    return this.http.post<void>(`${this.API_ENDPOINT}/${streamId}/respond-to-an-offer`, answer);
  }

  unlockStream(id: string, model: StreamUnlockModel): Observable<void> {
    return this.http.post<void>(`${this.API_ENDPOINT}/unlock/${id}`, { model });
  }
}
