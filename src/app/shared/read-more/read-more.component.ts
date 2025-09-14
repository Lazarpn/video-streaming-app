import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'vs-read-more',
  imports: [IconComponent, TranslatePipe],
  templateUrl: 'read-more.component.html',
  styleUrls: ['read-more.component.scss']
})

export class ReadMoreComponent implements OnChanges {
  @Input() text: string;
  @Input() label: string;
  @Input() maxCharacters: number;

  shortenedText: string;
  isExpanded: boolean = false;
  totalCharacters: number;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.text.currentValue !== changes.text.previousValue) {
      this.totalCharacters = this.text?.length;
      this.shortenedText = this.totalCharacters > this.maxCharacters
        ? `${this.text.slice(0, this.maxCharacters)}...`
        : this.text;
    }
  }

  expandText(): void {
    this.isExpanded = !this.isExpanded;
  }
}
