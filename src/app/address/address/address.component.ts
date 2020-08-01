// tslint:disable: variable-name
import { Component, OnInit, OnDestroy, forwardRef, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  FormControl,
} from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Address } from '../../address';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: AddressComponent,
      multi: true
    }
  ]
})
export class AddressComponent implements ControlValueAccessor, Validator, OnDestroy, OnInit {

  private _destroy$: Subject<void> = new Subject<void>();

  _form: FormGroup;

  @Input()
  editable = true;

  @Input()
  appearance = 'fill';

  @Input()
  showType = true;

  address: Address;

  countries = [
    {label: 'BRASIL', value: 'BR'},
    {label: 'MÉXICO', value: 'MX'}
  ];

  addressType = [
    {label: 'CASA', value: 'HOME'},
    {label: 'TRABALHO', value: 'WORK'},
  ];

  states = [
    {label: 'Acre', value: 'AC'},
    {label: 'Alagoas', value: 'AL'},
    {label: 'Amapá', value: 'AP'},
    {label: 'Amazonas', value: 'AM'},
    {label: 'Bahia', value: 'BA'},
    {label: 'Ceará', value: 'CE'},
    {label: 'Distrito Federal', value: 'DF'},
    {label: 'Espírito Santo', value: 'ES'},
    {label: 'Goiás', value: 'GO'},
    {label: 'Maranhão', value: 'MA'},
    {label: 'Mato Grosso', value: 'MT'},
    {label: 'Mato Grosso do Sul', value: 'MS'},
    {label: 'Minas Gerais', value: 'MG'},
    {label: 'Pará', value: 'PA'},
    {label: 'Paraíba', value: 'PB'},
    {label: 'Paraná', value: 'PR'},
    {label: 'Pernambuco', value: 'PE'},
    {label: 'Piauí', value: 'PI'},
    {label: 'Rio de Janeiro', value: 'RJ'},
    {label: 'Rio Grande do Norte', value: 'RN'},
    {label: 'Rio Grande do Sul', value: 'RS'},
    {label: 'Rondônia', value: 'RO'},
    {label: 'Roraima', value: 'RR'},
    {label: 'Santa Catarina', value: 'SC'},
    {label: 'São Paulo', value: 'SP'},
    {label: 'Sergipe', value: 'SE'},
    {label: 'Tocantins', value: 'TO'},
  ];

  private _onChange: (
    value: Address | null | undefined
  ) => void;

  private _onTouch: (value: any) => void;

  set value(val) {
    if (!val) {
      this.address = {};
      this._form.reset();
      return;
    }
    this.address = val;
    this._form.patchValue(val);
  }

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this._createFormGroup();
    this._setupObservables();
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  writeValue(val: Address | null | undefined): void {
    this.value = val;
  }

  registerOnChange(fn: (v: Address | null | undefined) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  setDisabledState(disabled: boolean): void {
    disabled ? this._form.disable()
             : this._form.enable();
  }

  validate(c: FormControl) {
    return this._form.invalid && {
      invalid: true
    };
  }

  private _createFormGroup() {
    this._form = this._fb.group({
      country: [{value: this.address?.country, disabled: !this.editable}, Validators.required],
      state: [{value: this.address?.state, disabled: !this.editable}, Validators.required],
      city: [{value: this.address?.city, disabled: !this.editable}, Validators.required],
      place: [{value: this.address?.place, disabled: !this.editable}, Validators.required],
      complement: [{value: this.address?.complement, disabled: !this.editable}],
      number: [{value: this.address?.number, disabled: !this.editable}, Validators.required],
      district: [{value: this.address?.district, disabled: !this.editable}, Validators.required],
      zipcode: [{value: this.address?.zipcode, disabled: !this.editable}, Validators.required],
      type: [{value: this.address?.type, disabled: !this.editable}, this.showType ? Validators.required : Validators.nullValidator],
    });

  }

  private _setupObservables() {
    this._form.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(value => {
      if (this._onChange) {
        this.address = value;
        this._onChange(value);
      }
    });
  }

}
