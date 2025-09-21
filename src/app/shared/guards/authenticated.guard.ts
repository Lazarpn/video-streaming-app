import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard {

  constructor(
    private router: Router,
    private accountService: AccountService
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.accountService.authenticated()) {
      return true;
    }

    const redirectUrl = `${environment.appBaseUrl}/${route.routeConfig.path}`;
    this.router.navigate(['/sign-in'], { queryParams: { redirectUrl } });
    return false;
  }
}
