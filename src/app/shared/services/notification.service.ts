import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

import { lastValueFrom } from 'rxjs';

import { ExceptionDetail } from '../exception-detail';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) { }

  async error(options: SnackBarErrorOptions) {
    if (options.exceptionDetail) {
      const anyErrors = options.exceptionDetail.params?.errors?.length > 0;
      const errorKey = anyErrors
        ? `errors.${options.exceptionDetail.params.errors[0]}`
        : `errors.${options.exceptionDetail.errorCode}`;
      options.message = await lastValueFrom(this.translateService.get(errorKey, options.exceptionDetail.params));
    }

    this.showSnackBar(options as SnackBarOptions);
  }

  async info(options: SnackBarOptions) {
    this.showSnackBar(options);
  }

  private async showSnackBar(options: SnackBarOptions) {
    if (!options.actionText) {
      options.actionText = await lastValueFrom(this.translateService.get('label.close'));
    }

    if (options.timeoutMs === undefined) {
      options.timeoutMs = 6000;
    }

    const snackBar = this.snackBar.open(options.message, options.actionText, {
      panelClass: 'snackBar',
      duration: options.timeoutMs ?? undefined
    });

    if (!options.action) {
      options.action = () => snackBar.dismiss();
    }

    snackBar.onAction().subscribe(() => options.action());
  }
}

export interface SnackBarOptions {
  message?: string;
  actionText?: string;
  action?: () => void;
  timeoutMs?: number | null;
}

export interface SnackBarErrorOptions extends SnackBarOptions {
  exceptionDetail?: ExceptionDetail;
}
