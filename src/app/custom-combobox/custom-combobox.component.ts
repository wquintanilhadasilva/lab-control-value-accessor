// tslint:disable: variable-name
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-combobox',
  templateUrl: './custom-combobox.component.html',
  styleUrls: ['./custom-combobox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomComboboxComponent),
      multi: true,
    }
  ]
})
export class CustomComboboxComponent implements ControlValueAccessor  {

  @Input()
  _counterValue = 0;

  get counterValue() {
    return this._counterValue;
  }

  set counterValue(val) {
    this._counterValue = val;
    this.propagateChange(this._counterValue);
  }

  increment($event) {
    this.counterValue++;
    $event.preventDefault();
  }

  decrement($event) {
    this.counterValue--;
    $event.preventDefault();
  }

  propagateChange = (_: any) => {};

  writeValue(value: any): void {
    if (value !== undefined) {
      this.counterValue = value;
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched() {}

}
