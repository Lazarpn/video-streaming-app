import { Component } from '@angular/core';

import { AccountService } from '../shared/services/account.service';

@Component({
  selector: 'vs-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  get userInfo() {
    return this.accountService.user
      ? `${this.accountService.user.firstName} ${this.accountService.user.lastName}`
      : 'NN';
  }

  constructor(private accountService: AccountService) { }
}
