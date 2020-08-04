import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AddressComponent } from './address/address/address.component';
import { Address } from './address';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  outerCounterValue = 15;
  form: FormGroup;

  data = {
    counter: 15,
    user: null,
    address: null,
  };

  data2 = {
    counter: 15,
      user: {
        id: '14',
        name: 'Usuário 14'
      }
  };

  role = {
    id: '19',
    name: 'Regra XPTO'
  };

  endereco: Address = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {

    this.endereco.city = 'Goiânia';
    this.endereco.complement = 'Complemento';
    this.endereco.district = 'District';
    this.endereco.state = 'GO';
    this.endereco.country = 'MX';
    this.endereco.type = 'WORK';

    this.form = this.fb.group({
      counter: this.data.counter,
      user: [this.data.user, Validators.required],
      user2: [this.data2.user, Validators.required],
      roles: [this.role, Validators.required],
      roles2: [null, Validators.required],
      address: [this.endereco, Validators.required],
    });

  }

  onSubmit(): void {
    console.log(this.form);
    this.data = this.form.value;
    console.log(this.data);
  }

  select(value) {
    console.log(value);
  }

}
