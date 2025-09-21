import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ButtonComponent } from '../../shared/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ExceptionDetail } from '../../shared/exception-detail';
import { SignUpModel } from '../../shared/models/user';
import { AccountService } from '../../shared/services/account.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'vs-sign-up',
  templateUrl: 'sign-up.component.html',
  styleUrls: ['sign-up.component.scss'],
  imports: [TranslatePipe, FormsModule, InputComponent, ButtonComponent]
})

export class SignUpComponent {
  model = {} as SignUpModel;
  confirmedPassword = '';

  isSigningUp: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private notification: NotificationService
  ) { }

  signUp() {
    this.isSigningUp = true;

    this.accountService.signUp(this.model).subscribe({
      next: _ => {
        this.isSigningUp = false;

        const redirectUrl = this.route.snapshot.queryParams.redirectUrl;

        if (redirectUrl) {
          location.href = redirectUrl;
          return;
        }

        location.reload();
      },
      error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
    });
  }

  private async handleErrors(errors: ExceptionDetail[]) {
    this.isSigningUp = false;
    await this.notification.error({ exceptionDetail: errors[0] });
  }
}
