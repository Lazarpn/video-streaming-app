import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';

import { catchError, EMPTY, Observable } from 'rxjs';

import { StreamMember } from '../models/stream';
import { StreamService } from '../services/stream.service';

@Injectable({ providedIn: 'root' })
export class MeetMemberResolver implements Resolve<StreamMember> {
  constructor(private streamService: StreamService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Observable<StreamMember> {
    const id = route.paramMap.get('streamId');

    return this.streamService.getMeetMember(id).pipe(
      catchError(_ => {
        this.router.navigate([`/stream/join/${id}`]);
        return EMPTY;
      })
    );
  }
}
