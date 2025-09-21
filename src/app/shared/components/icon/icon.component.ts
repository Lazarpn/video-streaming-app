import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'vs-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  @Input() iconName: string;
  @Input() iconVariant: number = 24;
  @Input() role: 'icon' | 'button' = 'icon';
  @Input() color: 'yellow' | 'default' | 'red' | 'gray-text' | 'white' = 'default';

  @Input()
  @HostBinding('style.fontSize.px')
  size: number;

  constructor() { }
}
