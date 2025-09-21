import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthenticatedGuard {

  constructor(
    private router: Router,
    private accountService: AccountService,
  ) { }

  canActivate(): boolean {
    if (!this.accountService.authenticated()) {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
}
