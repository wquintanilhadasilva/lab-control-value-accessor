import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomComboboxComponent } from './custom-combobox/custom-combobox.component';
import { AutocompleteUserComponent } from './autocomplete-user/autocomplete-user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { BoldMachingCharsPipe } from './bold-maching-chars.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { AutocompleteBaseComponent } from './autocomplete-base/autocomplete-base.component';
import { AutocompleteRolesComponent } from './autocomplete-roles/autocomplete-roles.component';
import { AddressModule } from './address/address.module';

@NgModule({
  declarations: [
    AppComponent,
    CustomComboboxComponent,
    AutocompleteUserComponent,
    BoldMachingCharsPipe,
    SafeHtmlPipe,
    AutocompleteBaseComponent,
    AutocompleteRolesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    AddressModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
