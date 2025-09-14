import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'vs-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: 'spinner.component.html',
  styleUrls: ['spinner.component.scss']
})

export class SpinnerComponent {
  @Input() color: 'accent' | 'alt' = 'accent';
  @Input() diameter: number = 100;
  @Input() strokeWidth: number = this.diameter / 10;

  constructor() { }
}
