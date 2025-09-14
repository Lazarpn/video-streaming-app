import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { TagComponent } from '../shared/components/tag/tag.component';
import { IconComponent } from '../shared/icon/icon.component';
import { UtilityService } from '../shared/services/utility.service';

@Component({
  selector: 'vs-expertise',
  imports: [IconComponent, TagComponent],
  templateUrl: './expertise.component.html',
  styleUrl: './expertise.component.scss'
})
export class ExpertiseComponent implements AfterViewInit {
  @ViewChild('heading', { read: ElementRef }) heading: ElementRef;
  @ViewChild('skillsWrapper', { read: ElementRef }) skillsWrapper: ElementRef;
  @ViewChild('iconAngular', { read: ElementRef }) iconAngular: ElementRef;
  @ViewChild('iconLaptop', { read: ElementRef }) iconLaptop: ElementRef;
  @ViewChild('iconLaptop2', { read: ElementRef }) iconLaptop2: ElementRef;

  databaseColor: 'white' | 'green' = 'white';

  constructor(private utilityService: UtilityService) { }

  ngAfterViewInit(): void {
    this.setAngularAnimation();
    this.setLaptopAnimation();
    this.registerAnimations();
  }

  private registerAnimations() {
    this.utilityService.addFadeInAnimation(this.heading.nativeElement, -500);
    this.utilityService.addFadeInAnimation(this.skillsWrapper.nativeElement, 500);
  }

  private setLaptopAnimation() {
    if (this.iconLaptop.nativeElement.style.fill === 'rgb(46, 70, 255)') {
      setTimeout(() => {
        this.iconLaptop.nativeElement.style.fill = 'rgb(255, 255, 255)';
        this.iconLaptop2.nativeElement.style.fill = 'rgb(255, 255, 255)';
        this.databaseColor = 'white';
      });
    } else {
      setTimeout(() => {
        this.iconLaptop.nativeElement.style.fill = '#2e46ff';
        this.iconLaptop2.nativeElement.style.fill = '#2e46ff';
        this.databaseColor = 'green';
      });
    }

    setTimeout(() => {
      this.setLaptopAnimation();
    }, 1500);
  }

  private setAngularAnimation() {
    if (this.iconAngular.nativeElement.style.fill === 'rgb(221, 0, 49)') {
      this.iconAngular.nativeElement.style.fill = 'rgb(255, 255, 255)';
    } else {
      this.iconAngular.nativeElement.style.fill = '#DD0031';
    }

    setTimeout(() => {
      this.setAngularAnimation();
    }, 1500);
  }
}
