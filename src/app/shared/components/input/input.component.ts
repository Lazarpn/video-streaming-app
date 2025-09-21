import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, OnChanges, Output, SimpleChanges, ViewChild
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'vs-input',
  templateUrl: 'input.component.html',
  styleUrls: ['input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputComponent),
    },
  ],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, TranslatePipe, CommonModule]
})
export class InputComponent implements AfterViewInit, OnChanges {
  @Input() placeholder: string;
  @Input() label: string;
  @Input() type: 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'time' | 'url' = 'text';
  @Input() name: string;
  @Input() value: string | number;
  @Input() pattern: string;
  @Input() patternError: string;
  @Input() shouldFocus = false;
  @Input() maxlength: string | number;

  @Input()
  @HostBinding('class.no-margin')
  noMargin = false;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
  }

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() focus = new EventEmitter<FocusEvent>();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() blur = new EventEmitter<FocusEvent>();

  @Output() enterHit = new EventEmitter<void>();

  @ViewChild('inputModel') inputModel: NgModel;
  @ViewChild('mainInput') mainInput: ElementRef;

  private _disabled: boolean;
  private _required: boolean;
  private _readonly: boolean;

  ngAfterViewInit() {
    if (this.shouldFocus) {
      setTimeout(() => {
        this.mainInput.nativeElement?.focus();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.errors && !changes.errors.firstChange) {
      if (changes.errors.currentValue.length) {
        this.inputModel?.control.setErrors({ 'incorrect': true });
        this.inputModel?.control.markAsDirty();
      } else {
        this.inputModel?.control.setErrors(null);
        this.inputModel?.control.updateValueAndValidity();
      }
    }
  }

  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this.value = value;
    this.updateChanges();
  }

  updateChanges() {
    this.onChange(this.value);
  }

  registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  focusInput() {
    this.mainInput.nativeElement.focus();
  }
}
