import { Component, ElementRef, HostBinding, HostListener, Input, ViewChild } from '@angular/core';

import { SocialProvider } from '../enums/social-provider';

@Component({
  selector: 'vs-social-button',
  standalone: true,
  templateUrl: 'social-button.component.html',
  styleUrls: ['social-button.component.scss']
})

export class SocialButtonComponent {
  @Input()
  @HostBinding('style.width.px')
  get width() {
    return this.getWidth();
  }
  set width(value: number) {
    this._width = value;
  }

  @Input()
  @HostBinding('style.height.px')
  height: number;

  @Input() color: 'white' | 'black' = 'black';
  @Input() provider: SocialProvider;
  @Input() customLink: string;

  @ViewChild('link') linkRef: ElementRef;

  @HostBinding('style.backgroundImage')
  get backgroundImage() {
    return `url(/assets/icons/socials/${this.provider.toLowerCase()}-${this.color}.${this.pngSocials.includes(this.provider) ? 'png' : 'svg'})`;
  }

  @HostListener('click', ['$event.target'])
  onClick() {
    this.linkRef.nativeElement.click();
  }

  pngSocials = [SocialProvider.YouTube];

  private _width: number;

  constructor() { }

  private getWidth() {
    if (this.provider === SocialProvider.YouTube) {
      return this._width * 1.417;
    }

    return this._width;
  }
}
