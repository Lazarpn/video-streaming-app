import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, forwardRef, HostBinding, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { MatFormField, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

import { ExceptionDetail } from '../exception-detail';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'vs-select',
  templateUrl: './select.component.html',
  standalone: true,
  imports: [MatFormField, IconComponent, MatSelectModule, FormsModule, TranslatePipe],
  styleUrls: ['./select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
  }],
})
export class SelectComponent implements OnChanges, ControlValueAccessor {
  @Input() id: string;
  @Input() name: string;
  @Input() validationPropertyName: string;
  @Input() label: string | null = null;
  @Input() additionalInfo: string;
  @Input() panelClass: string = '';
  @Input() options: any[];
  @Input() valueProperty: string;
  @Input() multiple: boolean = false;
  @Input() labelProperty: string;
  @Input() disabledProperty: string;
  @Input() small = false;
  @Input() mobile = false;
  @Input() prefixIcon = false;

  @Input()
  @HostBinding('class.no-margin')
  noMargin = false;

  @Input() errors: ExceptionDetail[] = [];

  private _disabled: boolean;
  private _required: boolean;

  @Input() value: any;
  @Input() placeholder: string;

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

  @ViewChild('selectModel') selectModel: NgModel;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() focus = new EventEmitter<FocusEvent>();
  @Output() selectionChange = new EventEmitter<MatSelectChange>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes.errors && !changes.errors.firstChange) {
      if (changes.errors.currentValue.length) {
        this.selectModel?.control.setErrors({ 'incorrect': true });
        this.selectModel?.control.markAsDirty();
      } else {
        this.selectModel?.control.setErrors(null);
        this.selectModel?.control.updateValueAndValidity();
      }
    }
  }

  getLabel(option: any) {
    return this.labelProperty ? option[this.labelProperty] : option;
  }

  getDisabled(option: any) {
    return this.disabledProperty ? option[this.disabledProperty] : false;
  }

  getOptionValue(option: any) {
    return this.valueProperty ? option[this.valueProperty] : option;
  }

  getOptionIcon() {
    const dropdownOption = this.options.find(option => option.value === this.value);
    return dropdownOption ? dropdownOption.icon : '';
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
}

