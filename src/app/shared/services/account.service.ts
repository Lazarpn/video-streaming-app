import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { lastValueFrom, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import { LS_USER_LANGUAGE, LS_USER_ROLES, LS_USER_TOKEN } from '../constants';
import { AuthResponseModel, SignInModel, SignUpModel, UserMeModel } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AccountService {
  user: UserMeModel = {} as UserMeModel;

  private tokenExpirationTimer: number;
  private readonly API_ENDPOINT: string = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) { }

  async getUserData(): Promise<void> {
    if (this.authenticated()) {
      this.user = await lastValueFrom(this.http.get<UserMeModel>(`${this.API_ENDPOINT}/me`));
    }
  }

  signUp(model: SignUpModel): Observable<AuthResponseModel> {
    return this.http
      .post<AuthResponseModel>(`${this.API_ENDPOINT}/register`, model)
      .pipe(tap(resData => {
        this.handleAuthentication(resData);
      }));
  }

  signIn(model: SignInModel): Observable<AuthResponseModel> {
    return this.http
      .post<AuthResponseModel>(`${this.API_ENDPOINT}/login`, model)
      .pipe(tap(resData => {
        this.handleAuthentication(resData);
      }));
  }

  signOut() {
    const language = localStorage.getItem(LS_USER_LANGUAGE);
    localStorage.clear();
    localStorage.setItem(LS_USER_LANGUAGE, language);
    location.href = '/';

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  authenticated(): boolean {
    return localStorage.getItem(LS_USER_TOKEN) != null;
  }

  handleAuthentication(authResponse: AuthResponseModel) {
    const parsedToken = this.parseJwt(authResponse.token);
    localStorage.setItem(LS_USER_TOKEN, authResponse.token);
    localStorage.setItem(LS_USER_ROLES, parsedToken.roles);
  }

  getLoggedUserRoles() {
    return localStorage.getItem(LS_USER_ROLES);
  }

  isInRole(roleName: string): boolean {
    if (!this.authenticated()) {
      return false;
    }

    const roles = this.getLoggedUserRoles();
    return !!roles && roles.includes(roleName);
  }

  private parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
