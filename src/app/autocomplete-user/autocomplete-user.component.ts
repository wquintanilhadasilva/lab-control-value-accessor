// tslint:disable: variable-name
import { Component, OnInit, forwardRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { User } from '../user';

import {Observable, of} from 'rxjs';
import {map, startWith, tap, delay, switchMap, debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete-user',
  templateUrl: './autocomplete-user.component.html',
  styleUrls: ['./autocomplete-user.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteUserComponent),
      multi: true,
    },
  ]
})
export class AutocompleteUserComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  USERS: User[] = [
    new User('1', 'Usuário 1'),
    new User('2', 'Usuário 2'),
    new User('3', 'Usuário 3'),
    new User('4', 'Usuário 4'),
    new User('5', 'Usuário 5'),
    new User('6', 'Usuário 6'),
    new User('7', 'Usuário 7'),
    new User('8', 'Usuário 8'),
    new User('9', 'Usuário 9'),
  ];

  _options$: Observable<User[]>;
  myControl = new FormControl();
  options: User[] = this.USERS; // string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<User[]>;

  user: User;

  onStart = true;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        debounceTime(1000), // só dispara a requisição após 1s sem digitar nada
        startWith(''), // caso venha nulo, adiciona o espaço em branco
        switchMap(value => of(this._filter(value))) // apenas uma única requisição será feita
      );
  }

  ngAfterViewInit(): void {
    this.onStart = false;
  }

  private _filter(value: string): User[] {

    if (!value) {

      if (!this.user) {
        if (!this.onStart) {
          this.propagateChange(null);
        }
      } else {
        if (!this.onStart) {
          this.user = null;
          this.propagateChange(null);
        }
      }
      return [];
    }

    if (typeof value === 'string') {

      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.name.toLowerCase().includes(filterValue));

    } else if (value === undefined) {
      return [];
    }

  }

  propagateChange = (_: any) => {};

  writeValue(value: any): void {
    if (value !== undefined) {
      this.user = value;
      this.myControl.setValue(value,
        // { emitEvent: false,
        //   emitModelToViewChange: false,
        //   emitViewToModelChange: false
        // }
      );
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {

  }

  /** Emite o valor escolhido */
  _emitsChosenOption(data: User) {
    this.propagateChange(data);
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }


}
