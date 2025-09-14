import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NativeDateAdapter } from '@angular/material/core';

import { animate, onScroll } from 'animejs';
import { BehaviorSubject, Subject } from 'rxjs';

import { ExceptionDetail } from '../exception-detail';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  scrollToTop = new Subject<void>();
  isMobile = new BehaviorSubject<boolean>(document.body.clientWidth <= 1024);
  isPhone = new BehaviorSubject<boolean>(document.body.clientWidth < 768);

  addFadeInAnimation(element: HTMLElement, offsetInPx: number = 0) {
    const container = document.querySelector('vs-root') as HTMLElement;

    animate(element, {
      translateX: [`${offsetInPx}px`, '0rem'],
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeOutCubic',
      autoplay: onScroll({ container })
    });
  }

  groupBy(array: any[], key: string): { key: string; group: any[] }[] {
    const groupedBy = array.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});

    const result = Object.keys(groupedBy).map((key => {
      return { key: key, group: groupedBy[key] };
    }));

    return result;
  }

  getInitials(firstName: string, lastName: string): string {
    const firstInitial = firstName?.charAt(0) || '';
    const lastInitial = lastName?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  createFormData(obj: any): FormData {
    const formData = new FormData();

    const appendFormData = (data: any, root: string | null = null) => {
      root = root || '';
      if (data instanceof File) {
        formData.append(root, data);
      } else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          appendFormData(data[i], root + '[' + i + ']');
        }
      } else if (data instanceof Date) {
        formData.append(root, data.toUTCString());
      } else if (typeof data === 'object' && data) {
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (root === '') {
              appendFormData(data[key], key);
            } else {
              appendFormData(data[key], root + '.' + key);
            }
          }
        }
      } else {
        if (data !== null && typeof data !== 'undefined') {
          formData.append(root, data);
        }
      }
    };

    appendFormData(obj);

    return formData;
  }

  parseJwt(token: string): any {
    const secondPartOfJwt = token.split('.')[1];
    const base64ForDecoding = secondPartOfJwt.replaceAll('-', '+').replaceAll('_', '/');

    const tokenString = this.b64DecodeUnicode(base64ForDecoding);
    return JSON.parse(tokenString);
  }

  b64DecodeUnicode(stringToDecode: string): string {
    return decodeURIComponent(
      Array.prototype.map.call(atob(stringToDecode), (c: string) =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
  }

  dataURItoBlob(dataURI: string) {
    const byteString = dataURI.split(',')[0].indexOf('base64') >= 0 ? atob(dataURI.split(',')[1]) : decodeURI(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  generateGuid(): string {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      }
    );
  }

  getDateBeforeNYears(numberOfYears: number): Date {
    const today = new Date();
    today.setFullYear(today.getFullYear() - numberOfYears);
    return today;
  }

  getDateAfterNYears(numberOfYears: number): Date {
    const today = new Date();
    today.setFullYear(today.getFullYear() + numberOfYears);
    return today;
  }

  errorsForField(fieldName: string, fieldSpecificErrors: string[], errorMessages: ExceptionDetail[], form: NgForm | null = null): ExceptionDetail[] {
    const errors: ExceptionDetail[] = [];

    for (const error of errorMessages) {
      if (fieldSpecificErrors.indexOf(error.errorCode) > -1) {
        errors.push(error);
      } else if (error.errorCode === 'RequestInvalid') {
        if (error.params.property === fieldName) {
          for (const subError of error.params.errors) {
            errors.push({
              errorCode: subError,
              params: {}
            });
          }
        }
      }
    }
    if (form) {
      const control = form.controls[fieldName];
      if (errors.length) {
        control?.setErrors({ 'incorrect': true });
        control?.markAsDirty();
      } else {
        control?.setErrors(null);
        control?.updateValueAndValidity();
      }
    }
    return errors;
  }

  scrollTo(element: HTMLDivElement, to: number, duration: number): void {
    const start = element.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
      currentTime += increment;
      const val = this.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }

  sort<T>(array: T[], property: string, isDesc: boolean = false): T[] {
    return array.sort((a: T, b: T) => {
      if (Array.isArray((a as any)[property]) || Array.isArray((b as any)[property])) {
        return this.sortByArrayLength((a as any)[property], (b as any)[property], isDesc);
      } else {
        return this.defaultSort((a as any)[property], (b as any)[property], isDesc);
      }
    });
  }

  defaultSort(valueA: any, valueB: any, isDesc: boolean = false) {
    if ((valueA === undefined || valueA === null) && valueB) {
      return 1;
    }

    if (valueA && (valueB === undefined || valueB === null)) {
      return -1;
    }
    if (valueA > valueB) {
      return isDesc ? -1 : 1;
    } else if (valueB > valueA) {
      return isDesc ? 1 : -1;
    }
    return 0;
  }

  randomizeArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  downloadFile(downloadUrl: string, isFromDmTray = false) {
    if (isFromDmTray) {
      const button = document.createElement('button');
      button.setAttribute('style', 'display:none;');
      button.setAttribute('type', 'submit');

      document.body.appendChild(button);
      button.onclick = () => {
        window.open(downloadUrl);
      };
      button.click();

      return;
    }

    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    a.setAttribute('download', 'download');
    document.body.appendChild(a);

    a.href = downloadUrl;
    a.click();
  }

  handlePlatformSpecificClass() {
    this.isIOS() ? document.body.classList.add('ios') : document.body.classList.remove('ios');
    this.isChromeOnIOS() ? document.body.classList.add('chrome-ios') : document.body.classList.remove('chrome-ios');
    this.isEmulator() ? document.body.classList.add('emulator') : document.body.classList.remove('emulator');
    this.isElectron() ? document.body.classList.add('electron') : document.body.classList.remove('electron');
    this.detectBrowserName() === 'safari' ? document.body.classList.add('safari') : document.body.classList.remove('safari');
  }

  isElementInViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const isInView = rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    return isInView;
  }

  moveElementInArray<T>(array: T[], fromIndex: number, toIndex: number) {
    const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

    if (startIndex >= 0 && startIndex < array.length) {
      const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

      const [item] = array.splice(fromIndex, 1);
      array.splice(endIndex, 0, item);
    }
  }

  getArrayWithNElements(n: number): Array<number> {
    return Array(n);
  }

  private isIOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.userAgent)
      || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
  }

  private isElectron() {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf('electron') > -1;
  }

  private isChromeOnIOS() {
    return navigator.userAgent.indexOf('CriOS') > -1;
  }

  private isEmulator() {
    return navigator.maxTouchPoints === 1;
  }

  private detectBrowserName() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('edge')) {
      return 'edge';
    }

    if (userAgent.includes('opr') && !!(window as any).opr) {
      return 'opera';
    }

    if (userAgent.includes('chrome') && !!(window as any).chrome) {
      return 'chrome';
    }

    if (userAgent.includes('trident')) {
      return 'ie';
    }

    if (userAgent.includes('firefox')) {
      return 'firefox';
    }

    if (userAgent.includes('safari')) {
      return 'safari';
    }

    return 'other';
  }

  private sortByArrayLength(arrayA: any[], arrayB: any[], isDesc: boolean = false) {
    if (arrayA?.length > arrayB?.length) {
      return isDesc ? -1 : 1;
    } else if (arrayB?.length > arrayA?.length) {
      return isDesc ? 1 : -1;
    }
    return 0;
  }

  private easeInOutQuad(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) {
      return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
}

@Injectable()
export class MonthYearDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: any): string {
    if (displayFormat === 'input') {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${month < 10 ? '0' : ''}${month}/${year}`;
    }
    return date.toDateString();
  }
}

export const MAT_MONTH_YEAR_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};

/**
 * Returns a random number between 1 and the passed maximum, inclusive of the maximum value.
 * @param inclusiveMax An integer greater or equal to 2.
 */
export function getRandomInt(inclusiveMax: number): number {
  return Math.floor(Math.random() * inclusiveMax) + 1;
}

/**
 * Returns randomly true or false with the probability passed
 * @param probability A number between 1 and a 100.
 */
export function exerciseProbability(probability: number): boolean {
  return getRandomInt(100) <= probability;
}

/**
 * Pads the given number with leading zeroes
 * @param num Number to pad
 * @param totalLength Total string length of the result
 */
export function padWithLeadingZeros(num: number, totalLength: number): string {
  return String(num).padStart(totalLength, '0');
}

/**
 * Unobserve passed HTML Element from an Observer
 * @param observer observer to unobserve
 * @param element Element to unobserve
 */
export function unobserve(observer: ResizeObserver | IntersectionObserver, element: Element | null): void {
  if (element) {
    observer.unobserve(element);
  }

  observer.disconnect();
}
