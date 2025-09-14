import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { TagComponent } from '../shared/components/tag/tag.component';
import { UtilityService } from '../shared/services/utility.service';
import { ProjectComponent } from './project/project.component';

@Component({
  selector: 'vs-projects',
  imports: [ProjectComponent, TagComponent, TranslatePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChild('heading', { read: ElementRef }) heading: ElementRef;
  @ViewChild('plean', { read: ElementRef }) plean: ElementRef;
  @ViewChild('idealWedding', { read: ElementRef }) idealWedding: ElementRef;
  @ViewChild('fonboard', { read: ElementRef }) fonboard: ElementRef;
  @ViewChild('brandedGames', { read: ElementRef }) brandedGames: ElementRef;
  @ViewChild('c2s', { read: ElementRef }) c2s: ElementRef;
  @ViewChild('background', { read: ElementRef }) background: ElementRef;

  constructor(private utilityService: UtilityService) { }

  ngAfterViewInit(): void {
    this.registerAnimations();
  }

  private registerAnimations() {

    this.utilityService.addFadeInAnimation(this.heading.nativeElement, -500);
    this.utilityService.addFadeInAnimation(this.plean.nativeElement, -500);
    this.utilityService.addFadeInAnimation(this.idealWedding.nativeElement, 500);
    this.utilityService.addFadeInAnimation(this.brandedGames.nativeElement, 500);
    this.utilityService.addFadeInAnimation(this.c2s.nativeElement, -500);
    this.utilityService.addFadeInAnimation(this.fonboard.nativeElement, -500);
    this.utilityService.addFadeInAnimation(this.background.nativeElement);
  }
}
