import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, PLATFORM_ID, SimpleChanges } from '@angular/core';

import { create as createLadda, LaddaButton } from 'ladda';

import { configAttributes, LaddaConfig, LaddaConfigArgs } from './ladda-config';

// Referenced from https://github.com/moff/angular2-ladda/blob/master/projects/ladda/src/lib/ladda.directive.ts
export type LaddaValue = boolean | number | undefined | null;

@Directive({
  selector: '[bgLadda]',
  standalone: false
})
export class LaddaDirective implements OnInit, OnDestroy, OnChanges {
  private el: HTMLButtonElement;
  private ladda: LaddaButton | undefined = undefined;

  @Input('bgLadda') loading: LaddaValue;
  @Input() disabled = false;

  constructor(
    el: ElementRef,
    @Inject(LaddaConfig) @Optional() config: LaddaConfigArgs,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    this.el = el.nativeElement;

    if (!config) {
      return;
    }

    // apply default styles if they aren't overwritten by an attribute
    for (const attribute in configAttributes) {
      const configValue = config[configAttributes[attribute]];

      if (!configValue) {
        continue; // don't waste time reading the attribute
      }

      if (!this.el.getAttribute(attribute)) {
        // attribute isn't set - apply the default config value
        const value = (typeof configValue === 'number') ? configValue.toString() : configValue;
        this.el.setAttribute(attribute, value);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.ladda) {
      return; // needed since ngOnChanges is called before ngOnInit
    }

    if (changes.loading) {
      this.updateLadda(changes.loading.previousValue);
    }

    if (changes.disabled) {
      this.updateDisabled();
    }
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.ladda = createLadda(this.el);

    // if the initial loading value isn't false, a timeout of 0 ms
    // is necessary for the calculated spinner size to be correct.
    setTimeout(() => { this.updateLadda(false); }, 0);
  }

  ngOnDestroy() {
    if (this.ladda) {
      this.ladda.remove();
    }
  }

  private updateLadda(previousValue: LaddaValue): void {
    if (!this.ladda) {
      return;
    }

    const loading: boolean = typeof this.loading === 'number' || !!this.loading;
    const wasLoading: boolean = typeof previousValue === 'number' || !!previousValue;

    if (!loading) {
      if (wasLoading) {
        this.ladda.stop();
      }

      return this.updateDisabled();
    }

    if (!wasLoading) {
      this.ladda.start();
    }

    if (typeof this.loading === 'number') {
      this.ladda.setProgress(this.loading);
    }
  }

  private updateDisabled(): void {
    this.el.disabled = this.disabled;
  }
}
