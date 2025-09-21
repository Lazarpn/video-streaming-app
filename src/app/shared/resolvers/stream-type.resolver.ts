import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { StreamTypeModel } from '../models/stream';
import { StreamService } from '../services/stream.service';

@Injectable({ providedIn: 'root' })
export class StreamTypeResolver {
  constructor(private streamService: StreamService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<StreamTypeModel> {
    const streamId = route.paramMap.get('streamId');
    return this.streamService.getStreamType(streamId);
  }
}
