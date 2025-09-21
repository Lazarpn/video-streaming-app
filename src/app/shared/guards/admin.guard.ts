import { Injectable } from '@angular/core';

import { UserRole } from '../models/user-role';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {

  constructor(
    private accountService: AccountService
  ) { }

  canActivate(): boolean {
    if (this.accountService.isInRole(UserRole.Administrator)) {
      return true;
    }

    this.accountService.signOut();
    return false;
  }
}
