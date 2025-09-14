import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import Typewriter from 'typewriter-effect/dist/core';

import { ButtonComponent } from '../shared/button/button.component';
import { TagComponent } from '../shared/components/tag/tag.component';
import { UtilityService } from '../shared/services/utility.service';

@Component({
  selector: 'vs-contact',
  imports: [ButtonComponent, TagComponent, TranslatePipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements AfterViewInit {
  @ViewChild('name', { read: ElementRef }) name: ElementRef;
  @ViewChild('iAmNotHardToFind', { read: ElementRef }) iAmNotHardToFind: ElementRef;
  @ViewChild('letsCreateSomethingGreat', { read: ElementRef }) letsCreateSomethingGreat: ElementRef;
  @ViewChild('info', { read: ElementRef }) info: ElementRef;
  @ViewChild('tagWrapper', { read: ElementRef }) tagWrapper: ElementRef;
  @ViewChild('buttonWrapper', { read: ElementRef }) buttonWrapper: ElementRef;

  constructor(private utilityService: UtilityService, private host: ElementRef) { }

  ngAfterViewInit(): void {
    this.registerAnimations();
    this.setInterceptor();
  }

  sendEmail() {
    window.location.href = 'mailto:lazarst.pn@gmail.com';
  }

  phoneContact() {
    window.location.href = 'tel:+381 61 29 87 606';
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
          const typewriter = new Typewriter(this.name.nativeElement, {
            loop: false,
            delay: 50
          });

          typewriter.typeString(`Spectacular!`).start();
        }
      });
    }, options);

    observer.observe(this.host.nativeElement);
  }

  private registerAnimations() {
    this.utilityService.addFadeInAnimation(this.iAmNotHardToFind.nativeElement, -500);
    this.utilityService.addFadeInAnimation(this.letsCreateSomethingGreat.nativeElement, -500);
    this.utilityService.addFadeInAnimation(this.info.nativeElement, -500);
    this.utilityService.addFadeInAnimation(this.tagWrapper.nativeElement, -500);
    this.utilityService.addFadeInAnimation(this.buttonWrapper.nativeElement, 500);
  }
}
