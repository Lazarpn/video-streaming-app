import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonComponent } from '../shared/button/button.component';
import { InputComponent } from '../shared/components/input/input.component';
import { StreamType } from '../shared/enums/stream-type.enum';
import { ExceptionDetail } from '../shared/exception-detail';
import { StreamCreateModel } from '../shared/models/stream';
import { SelectComponent } from '../shared/select/select.component';
import { NotificationService } from '../shared/services/notification.service';
import { StreamService } from '../shared/services/stream.service';

@Component({
  selector: 'vs-new-meet',
  templateUrl: 'new-meet.component.html',
  styleUrls: ['new-meet.component.scss'],
  imports: [ButtonComponent, InputComponent, SelectComponent, FormsModule]
})

export class NewMeetComponent {
  streamOptions: StreamType[] = [StreamType.Public, StreamType.Private];
  selectedStreamType: StreamType = StreamType.Public;

  streamPassword: string = '';
  StreamTypeEnum = StreamType;

  constructor(
    private streamService: StreamService,
    private router: Router,
    private notification: NotificationService
  ) { }

  createStream() {
    const model: StreamCreateModel = {
      type: this.selectedStreamType,
      password: this.streamPassword
    };

    this.streamService.createStream(model).subscribe({
      next: streamModel => {
        this.router.navigate([`/stream/join/${streamModel.id}`]);
      },
      error: async (errors: ExceptionDetail[]) => await this.handleErrors(errors)
    });
  }

  private async handleErrors(errors: ExceptionDetail[]) {
    await this.notification.error({ exceptionDetail: errors[0] });
  }
}
