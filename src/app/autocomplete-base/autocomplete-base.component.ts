// tslint:disable: variable-name
import { Component,
  OnInit,
  forwardRef,
  AfterViewInit,
  Input,
  TemplateRef,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete-base',
  templateUrl: './autocomplete-base.component.html',
  styleUrls: ['./autocomplete-base.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteBaseComponent),
      multi: true,
    },
  ]
})
export class AutocompleteBaseComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

  private _optionsData: Observable<any[]>;
  private _myControl: FormControl;
  private onStart = true;
  private _hasLoad = false;
  private _hasData = false;
  private _lostFocus = false;
  private subscription: Subscription;

  @ViewChild('noOptonItemRefTemplate')
  private noOptonItemRefTemplate: TemplateRef<any>;

  @Input()
  optionItemTemplate: TemplateRef<any>;

  @Input()
  labelText: string;

  @Output()
  filterChange: EventEmitter<string> = new EventEmitter();

  @Output()
  selectItem: EventEmitter<any> = new EventEmitter();

  @Input()
  displayWithFn: (data: any) => void;

  @Input()
  set dataList(value: Observable<any[]>) {
    this._optionsData = value;
    if (value) {
      this.subscription = value.subscribe(v => {
        if (this._lostFocus && v && v.length === 0) {
          // this.propagateChange(null);
          this.form.setValue(null); // , {emitEvent: false, emitViewToModelChange: true, emitModelToViewChange: true});
        }
      });
    }
    this._hasLoad = false;
  }

  get dataList(): Observable<any[]> {
    return this._optionsData;
  }

  @Input()
  set form(form: FormControl) {
    this._myControl = form;
  }

  get form(): FormControl {
    return this._myControl;
  }

  ngOnInit() {

    this.form.valueChanges
      .pipe(
        debounceTime(1000), // só dispara a requisição após 1s sem digitar nada
        startWith(''), // caso venha nulo, adiciona o espaço em branco
        // switchMap(value => this._filter(value)) // apenas uma única requisição será feita
      ).subscribe(value => this._filter(value));

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.onStart = false;
  }

  private _filter(value: string): any {
    console.log(value);
    if (value) {

      if (!value) {
        if (!this.onStart) {
          this.propagateChange(null);
          this.selectItem.emit(null);
        }
        this.dataList = of([]);
      }

      console.log('value is not null');

      if (typeof value === 'string') {

        console.log('typeof is string');
        if (value !== '') {
          console.log(value);
          this._hasLoad = true;
          this.filterChange.emit(value);
        } else {
          console.log('value === ""');
          this.propagateChange(null);
          this.selectItem.emit(null);
        }

      } else if (value === undefined || value === null) {
        this.propagateChange(null);
        this.selectItem.emit(null);
        console.log('typeof is undefined or null');
      } else {
        this.propagateChange(value);
        this.selectItem.emit(value);
      }

    } else {

      console.log('value is null or undefined');

      this._hasData = false;
      if (!this.onStart || this._hasLoad) {
        this.propagateChange(null);
        this.selectItem.emit(null);
      }

    }

  }

  propagateChange = (_: any) => {}

  writeValue(value: any): void {
    if (value !== undefined) {
      this.form.setValue(value);
    }
    this.selectItem.emit(value);
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {

  }

  /** Emite o valor escolhido */
  _emitsChosenOption(data: any) {
    this.propagateChange(data);
    this.selectItem.emit(data);
    this.dataList = of([]);
  }

  getOptionItemTemplate(): TemplateRef<any> {
    if (this.optionItemTemplate) {
      return this.optionItemTemplate;
    } else {
      return this.noOptonItemRefTemplate;
    }
  }

  focusOut(): void {
    this._lostFocus = true;
    if (!this._hasData && this._hasLoad) {
      this.form.setValue(null);
    }
  }

  focusIn(): void {
    this._hasLoad = false;
    this._lostFocus = false;
  }

}
