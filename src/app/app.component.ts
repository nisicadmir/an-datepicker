import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDatepickerOptions } from 'an-datepicker';

import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  public form: FormGroup;

  public date_min: moment.Moment = moment().add(2, 'day');
  public date_min2: moment.Moment = moment().subtract(1, 'day');

  public d: any;

  options: IDatepickerOptions = {
    minYear: 2000,
    inputHeight: 30,
    calendarWidth: '300px',
    // positionFixed: true,
    inputWidth: '390px',
    // onlyCalendar: true,
    // readonly: true,
    onSelectClose: false,
  };
  constructor(private fb: FormBuilder) {
    this.form_create();
  }
  form_create() {
    this.form = this.fb.group({
      date: [null, Validators.required],
      someDummy: [''],
    });
  }

  form_submit() {
    console.log('this.form.value', this.form.value);
  }

  ngOnInit() {}

  onClick(event) {
    console.log('event', event);
  }
}
