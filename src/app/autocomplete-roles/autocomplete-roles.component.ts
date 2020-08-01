// tslint:disable: variable-name
import { Component, OnInit, forwardRef } from '@angular/core';
import { User } from '../user';
import { Observable, of } from 'rxjs';
import { AutoComplete } from '../autocomplete-base/autocomplete';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-autocomplete-roles',
  templateUrl: './autocomplete-roles.component.html',
  styleUrls: ['./autocomplete-roles.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteRolesComponent),
      multi: true,
    },
  ]
})
export class AutocompleteRolesComponent extends AutoComplete implements OnInit {

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
    new User('10', 'MARIA'),
    new User('11', 'Pedro'),
    new User('12', 'João'),
  ];

  _data: Observable<User[]>;

  get data(): Observable<User[]> {
    return this._data;
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  filter(filter: string): void {
    if (filter) {
      const d = this.USERS.filter(option => option.name.toLowerCase().includes(filter.toLowerCase()));
      this._data = of(d);
    // } else {
    //   this._data = of(this.USERS);
    }
  }

  displayFn(user: User): string {
    return user && user.name ? `${user.name}-${user.id}` : '';
  }

}
