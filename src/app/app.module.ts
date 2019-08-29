import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnDatepickerModule } from 'projects/an-datepicker/src/public_api';
// import { AnDatepickerModule } from 'an-datepicker';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AnDatepickerModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
