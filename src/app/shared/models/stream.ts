import { StreamType } from '../enums/stream-type.enum';

export interface StreamTypeModel {
  type: StreamType;
  userOwnerId: string;
}

export interface StreamModel {
  id: string;
  type: StreamType;
  userOwnerId: string;
}

export interface StreamCreateModel {
  type: StreamType;
  password?: string;
}

export interface StreamUnlockModel {
  password: string;
}

// Equivalent to backend: RtcSessionDescription
export interface RtcSessionDescription {
  type: 'offer' | 'answer';
  sdp: string;
}

// Equivalent to backend: RtcIceCandidate
export interface RtcIceCandidate {
  candidate: string;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
  usernameFragment?: string;
}

// Equivalent to backend: PeerMessage
export interface PeerMessage {
  type: 'offer' | 'answer' | 'ice';
  sdp?: RtcSessionDescription;       // used if type is offer/answer
  candidate?: RtcIceCandidate;       // used if type is ice
}

// Equivalent to backend: PeerSignal
export interface PeerSignal {
  fromId: string;    // SignalR connectionId or Guid as string
  toId: string;      // Guid as string of the target peer
  message: PeerMessage;
}
