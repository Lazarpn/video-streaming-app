import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { TagComponent } from '../shared/components/tag/tag.component';
import { ReadMoreComponent } from '../shared/read-more/read-more.component';
import { UtilityService } from '../shared/services/utility.service';

@Component({
  selector: 'vs-about-me',
  imports: [TagComponent, TranslatePipe, ReadMoreComponent],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.scss',
})
export class AboutMeComponent implements AfterViewInit {
  @ViewChild('aboutMeInfo') aboutMeInfo: ElementRef;
  @ViewChild('aboutMePhoto') aboutMePhoto: ElementRef;

  constructor(private utilityService: UtilityService) { }

  ngAfterViewInit(): void {
    this.registerAnimations();
  }

  private registerAnimations() {
    this.utilityService.addFadeInAnimation(this.aboutMeInfo.nativeElement, -500);
    this.utilityService.addFadeInAnimation(this.aboutMePhoto.nativeElement, 500);
  }
}
