import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PeerSignal, StreamCreateModel, StreamModel, StreamTypeModel, StreamUnlockModel } from '../models/stream';

@Injectable({ providedIn: 'root' })
export class StreamService {
  private readonly API_ENDPOINT = `${environment.apiUrl}/meets`;

  constructor(private http: HttpClient) { }

  createStream(model: StreamCreateModel): Observable<StreamModel> {
    return this.http.post<StreamModel>(this.API_ENDPOINT, model);
  }

  sendIceCandidate(streamId: string, signal: PeerSignal): Observable<void> {
    return this.http.post<void>(`${this.API_ENDPOINT}/${streamId}/ice`, signal);
  }


  joinStream(id: string): Observable<void> {
    return this.http.post<void>(`${this.API_ENDPOINT}/${id}/join`, {});
  }

  leaveStream(id: string): Observable<void> {
    return this.http.post<void>(`${this.API_ENDPOINT}/${id}/leave`, {});
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
