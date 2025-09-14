import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import Typewriter from 'typewriter-effect/dist/core';

import { ButtonComponent } from '../shared/button/button.component';
import { TagComponent } from '../shared/components/tag/tag.component';

@Component({
  selector: 'vs-hero',
  imports: [ButtonComponent, TagComponent, TranslatePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements AfterViewInit {
  @ViewChild('name', { read: ElementRef }) name: ElementRef;
  @ViewChild('nameMobile', { read: ElementRef }) nameMobile: ElementRef;

  ngAfterViewInit(): void {
    const typewriter = new Typewriter(this.name.nativeElement, {
      loop: false,
      delay: 50
    });

    typewriter.typeString(`Lazar Stojanovic`).start();

    const typewriterMobile = new Typewriter(this.nameMobile.nativeElement, {
      loop: false,
      delay: 50
    });

    typewriterMobile.typeString(`Lazar Stojanovic`).start();
  }

  sendEmail() {
    window.location.href = 'mailto:lazarst.pn@gmail.com';
  }
}
