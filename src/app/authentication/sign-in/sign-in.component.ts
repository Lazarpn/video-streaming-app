import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { ButtonComponent } from '../../shared/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ExceptionDetail } from '../../shared/exception-detail';
import { SignInModel } from '../../shared/models/user';
import { AccountService } from '../../shared/services/account.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'vs-sign-in',
  templateUrl: 'sign-in.component.html',
  styleUrls: ['sign-in.component.scss'],
  imports: [TranslatePipe, InputComponent, FormsModule, ButtonComponent]
})

export class SignInComponent {
  model = {} as SignInModel;

  isSigningIn: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private notification: NotificationService
  ) { }

  signIn() {
    this.isSigningIn = true;

    this.accountService.signIn(this.model).subscribe({
      next: _ => {
        this.isSigningIn = false;
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

  signUp() {
    this.router.navigate(['/sign-up']);
  }

  private async handleErrors(errors: ExceptionDetail[]) {
    this.isSigningIn = false;
    await this.notification.error({ exceptionDetail: errors[0] });
  }
}
