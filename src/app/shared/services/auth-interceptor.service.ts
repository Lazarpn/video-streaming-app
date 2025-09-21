import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { LS_USER_TOKEN, SS_SOCKET_CONNECTION_ID } from '../constants';
import { ExceptionDetail } from '../exception-detail';
import { AccountService } from './account.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private accountService: AccountService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(LS_USER_TOKEN);
    let headers = request.headers;

    if (token && request.url.indexOf(environment.apiBaseUrl) > -1) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const socketConnectionId = sessionStorage.getItem(SS_SOCKET_CONNECTION_ID);

    if (socketConnectionId) {
      headers = headers.set('SocketConnectionId', socketConnectionId);
    }

    request = request.clone({ headers });

    return next.handle(request).pipe(
      map((response: any) => {
        if (response instanceof HttpResponse) {
          const refreshedToken = response.headers.get('refreshed-token');
          if (refreshedToken) {
            localStorage.setItem(LS_USER_TOKEN, refreshedToken);
          }
        }
        return response;
      }),
      catchError((response, caught) => this.handleErrors(response, caught))
    );
  }

  private handleErrors(response: any, _: Observable<HttpEvent<any>>) {
    if (response instanceof HttpErrorResponse) {
      if (response.status === 401) {
        this.processAuthError();
        return throwError(() => response.error);
      }

      if (typeof response.error === 'object') {
        if (Array.isArray(response.error)) {
          const payload = response.error as ExceptionDetail[];
          return throwError(() => payload);
        } else {
          if (response.status === 0) {
            console.log(
              'Please wait 1-2 minutes and refresh the page while we reconnect you to our servers. Thank you for your understanding.'
            );
          }
          return throwError(() => response.error);
        }
      } else if (typeof response.error === 'string') {
        const errors: ExceptionDetail[] = [];
        if (response.error.indexOf('Status Code: 404; Not Found') >= 0) {
          return throwError(() => errors);
        } else if (response.error.indexOf('Status Code: 403; Forbidden') >= 0) {
          errors.push({ errorCode: 'AuthorizationError' } as ExceptionDetail);
          return throwError(() => errors);
        }
        errors.push({ errorCode: 'InternalServerError' } as ExceptionDetail);
        return throwError(() => errors);
      }

      return throwError(() => response.error);
    }

    return throwError(() => response);
  }

  private processAuthError(): void {
    if (window.location.pathname.indexOf('login') >= 0) {
      return;
    }

    this.accountService.signOut();
  }
}
