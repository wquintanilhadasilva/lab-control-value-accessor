// tslint:disable: variable-name
import { Output, EventEmitter, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';

export abstract class AutoComplete implements OnInit, ControlValueAccessor {

  private _formControl: FormControl = new FormControl();

  public get formControl(): FormControl {
    return this._formControl;
  }

  @Output()
  selectItem: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }

  propagateChange = (_: any) => {};

  writeValue(value: any): void {
    this.selectItem.emit(value);
    if (value !== undefined) {
      this.formControl.setValue(value);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    // throw new Error('Method not implemented.');
  }

  setDisabledState?(isDisabled: boolean): void {
    // throw new Error('Method not implemented.');
  }

  emitsChosenOption(data: any) {
    this.propagateChange(data);
    this.selectItem.emit(data);
  }

}
