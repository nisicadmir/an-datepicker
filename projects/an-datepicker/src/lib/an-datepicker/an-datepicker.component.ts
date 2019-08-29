import { Component, OnInit, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS } from '@angular/forms';

import { AbstractDatepicker } from '../abstract-datepicker';
import { IDatepickerOptions, DatepickerOptions } from '../_models/main.model';
import variables from '../_utils/variables';

import * as momentImported from 'moment';
const moment = momentImported;

@Component({
  selector: 'an-datepicker',
  templateUrl: './an-datepicker.component.html',
  styleUrls: ['./an-datepicker.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AnDatepickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AnDatepickerComponent),
      multi: true,
    },
  ],
})
export class AnDatepickerComponent extends AbstractDatepicker<IDatepickerOptions>
  implements ControlValueAccessor, OnInit, OnChanges {
  constructor() {
    super();
  }

  ngOnInit() {
    this.initOptionsWithTimeout();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.initOptionsWithTimeout();
    }
  }

  // will wait for interval to init options at once
  private initOptionsWithTimeout(): void {
    this.options_interval = setTimeout(() => {
      clearTimeout(this.options_interval);
      this.init_all();
    }, variables.init_options_interval);
  }

  private init_options(): void {
    // change format to daeminvalidate
    this.optionsModel = new DatepickerOptions(
      this.dateDisplayFormat || 'DD.MM.YYYY',
      this.placeholder,
      this.dateInit,
      this.minSelectableDate,
      this.maxSelectableDate,
      this.dateMinValidate,
      this.dateMaxValidate,
      this.selecableDates,
      this.firstDayOfWeek,
      this.locale,
      this.isReadonly,
      this.isDisabledInput,
      this.options.minYear,
      this.options.maxYear,
      this.options.dateReturnType,
      this.options.dayNamesFormat,
      this.options.isOnlyCalendar,
      this.options.calendarPosition,
      this.options.calendarPosition ? true : false,
      this.options.calendarWidth,
      this.options.calendarPadding,
      this.options.inputWidth,
      this.options.inputHeight,
      this.options.dayWidthHeight,
      this.options.dayBorderRadius,
      this.options.inputId,
      this.options.inputClass,
      (7 * (this.options.dayWidthHeight || 30) * 14.28) / 13,
      this.options.onSelectClose
    );
    moment.locale(this.locale || 'en');
  }

  private init_all(): void {
    this.init_options();
    this.init_days();
    this.init_years();
    this.init_dayNames();
  }

  public valuDate_set(day: momentImported.Moment): void {
    const previousSelectedDate =
      (this.dateSelected && this.dateSelected.clone()) || this.optionsModel.dateInit;
    this.value_set(day);
    if (!day.isSame(previousSelectedDate, 'month')) {
      this.optionsModel.dateInit = day;
      this.init_days();
      this.init_dayNames();
    }
    this.init_days();
  }

  public datepicker_toggle(): void {
    this.opened = !this.opened;
    this.clicked_times = 0;
  }
}
