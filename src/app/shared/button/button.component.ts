import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

import { IconComponent } from '../icon/icon.component';
import { LaddaModule } from '../ladda/ladda.module';

@Component({
  selector: 'vs-button',
  templateUrl: 'button.component.html',
  styleUrls: ['button.component.scss'],
  imports: [IconComponent, LaddaModule]
})
export class ButtonComponent {
  @Input()
  @HostBinding()
  color: 'primary' | 'secondary' | 'tertiary' = 'primary';

  @Input() iconName: string;
  @Input() iconColor: 'yellow' | 'default' | 'red' | 'white';
  @Input() iconOnly: boolean;
  @Input() iconSize: number;
  @Input() iconVariant: number;
  @Input() type: string;
  @Input() isLoading = false;
  @Input() disabled = false;

  @Output() buttonClick = new EventEmitter<MouseEvent>();
}
