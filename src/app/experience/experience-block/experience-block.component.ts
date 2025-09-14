import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

import Typewriter from 'typewriter-effect/dist/core';

import { ReadMoreComponent } from '../../shared/read-more/read-more.component';
import { UtilityService } from '../../shared/services/utility.service';

@Component({
  selector: 'vs-experience-block',
  imports: [ReadMoreComponent],
  templateUrl: './experience-block.component.html',
  styleUrl: './experience-block.component.scss'
})
export class ExperienceBlockComponent implements AfterViewInit {
  @Input() title: string;
  @Input() description: string;

  @ViewChild('text', { read: ElementRef }) text: ElementRef;
  @ViewChild('descriptionRef', { read: ElementRef }) descriptionRef: ElementRef;
  @ViewChild('descriptionRefMobile', { read: ElementRef }) descriptionRefMobile: ElementRef;

  filled = 0;
  maxFill: number;

  observer: IntersectionObserver | null = null;

  constructor(private host: ElementRef, private utilityService: UtilityService) { }

  ngAfterViewInit(): void {
    this.setInterceptor();
    this.registerAnimations();
  }

  private registerAnimations() {
    this.utilityService.addFadeInAnimation(this.descriptionRef.nativeElement, 500);
    this.utilityService.addFadeInAnimation(this.descriptionRefMobile.nativeElement, 500);
  }

  setInterceptor() {
    const options = {
      root: null,
      rootMargin: '-200px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries, _) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.typeText();

          setTimeout(() => {
            observer.unobserve(this.host.nativeElement);
          }, 1000);
        }
      });
    }, options);

    observer.observe(this.host.nativeElement);
  }

  typeText() {
    const typewriter = new Typewriter(this.text.nativeElement, {
      loop: false,
      delay: 100
    });

    typewriter.typeString(`${this.title}`).start();
  }
}
