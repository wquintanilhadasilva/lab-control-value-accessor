// tslint:disable: max-line-length
// tslint:disable: variable-name
import { Component, OnInit, OnDestroy, forwardRef, Input, EventEmitter, Output } from '@angular/core';
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

import { Subject, Observable, BehaviorSubject } from 'rxjs';
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
  showType = false;

  @Input()
  required = true;

  @Output()
  countrySelected: EventEmitter<any> = new EventEmitter();

  @Output()
  stateSelected: EventEmitter<any> = new EventEmitter();

  @Output()
  citySelected: EventEmitter<any> = new EventEmitter();

  @Output()
  typeSelected: EventEmitter<any> = new EventEmitter();

  states_sub$: BehaviorSubject<{label: string, value: string}[]> = new BehaviorSubject([]);

  address: Address;

  editing = false;

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
      this.editing = true;
      return;
    }
    this.address = val;
    this._form.patchValue(val);
    this.editing = true;
  }

  get states$(): Observable<{label: string, value: string}[]> {
    return this.states_sub$.asObservable();
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
    console.log('write');
    console.log(val);
    this.editing = false;
    this.value = val;
    if (val?.country) {
      this.loadState(val.country);
    }
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
      country: [{value: this.address?.country, disabled: !this.editable}, this.required ? Validators.required : Validators.nullValidator],
      state: [{value: this.address?.state, disabled: !this.editable}, this.required ? Validators.required : Validators.nullValidator],
      city: [{value: this.address?.city, disabled: !this.editable}, this.required ? Validators.required : Validators.nullValidator],
      place: [{value: this.address?.place, disabled: !this.editable}, this.required ? Validators.required : Validators.nullValidator],
      complement: [{value: this.address?.complement, disabled: !this.editable}],
      number: [{value: this.address?.number, disabled: !this.editable}, this.required ? Validators.required : Validators.nullValidator],
      district: [{value: this.address?.district, disabled: !this.editable}, this.required ? Validators.required : Validators.nullValidator],
      zipcode: [{value: this.address?.zipcode, disabled: !this.editable}, this.required ? Validators.required : Validators.nullValidator],
      type: [{value: this.address?.type, disabled: !this.editable}, this.showType && this.required ? Validators.required : Validators.nullValidator],
    });

  }

  onSelectCountry(value) {
    // clear state and city
    this.address.state = null;
    this.address.city = null;
    this.value = this.address;
    this.countrySelected.emit(value);
    this.loadState(value);
  }

  onSelectState(value) {
    // clear city
    this.address.city = null;
    this.value = this.address;
    this.stateSelected.emit(value);
  }

  private _setupObservables() {
    this._form.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(value => {
      if (this._onChange) {
        if (this.editing) {
          this.address = value;
          this._onChange(value);
        }
        this.editing = true;
      }
    });
  }

  private loadState(country: string): void {
    console.log(country);
    if (country === 'BR') {
      this.states_sub$.next(this.states);
    } else {
      this.states_sub$.next([]);
    }
  }

}
