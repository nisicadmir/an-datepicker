import { Component, OnInit, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS } from '@angular/forms';

import { AbstractDatepicker } from '../abstract-datepicker';
import { DatetimepickerOptions, IDatepickerOptions } from '../_models/main.model';
import variables from '../_utils/variables';

import * as momentImported from 'moment';
const moment = momentImported;

@Component({
  selector: 'an-datetimepicker',
  templateUrl: './an-datetimepicker.component.html',
  styleUrls: ['./an-datetimepicker.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AnDatetimepickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AnDatetimepickerComponent),
      multi: true,
    },
  ],
})
export class AnDatetimepickerComponent extends AbstractDatepicker<IDatepickerOptions>
  implements ControlValueAccessor, OnInit, OnChanges {
  @Input() private hourStep: number; // optional, step when changing hour, default 1, can be provided in DatetimePickerOptions also
  @Input() private minuteStep: number; // optional, step when changing minute, default 5, can be provided in DatetimePickerOptions also
  @Input() private showMeridiem: boolean; // optional, show meridiem or not, default false, can be provided in DatetimePickerOptions also

  public show_time: boolean = false;

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
    this.optionsModel = new DatetimepickerOptions(
      this.dateDisplayFormat || 'DD.MM.YYYY HH:mm',
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
      this.hourStep,
      this.minuteStep,
      this.showMeridiem
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
    if (this.date_selected) {
      const newDate = day.clone();
      newDate.hour(this.date_selected.hour());
      newDate.minute(this.date_selected.minute());
      this.value_set(newDate);
    } else {
      this.value_set(day);
    }
    this.init_days();
  }

  public datepicker_toggle(): void {
    this.opened = !this.opened;
    this.clicked_times = 0;
    this.show_time_close();
  }

  public show_time_toggle(): void {
    this.show_time = !this.show_time;
  }
  private show_time_close(): void {
    this.show_time = false;
  }

  public hour_change(inc_dec: string): void {
    switch (inc_dec) {
      case 'inc':
        const dateToInc = this.date_selected.clone().add(this.optionsModel.hourStep, 'hour');
        if (
          this.optionsModel.maxSelectableDate &&
          dateToInc.isSameOrBefore(this.optionsModel.maxSelectableDate)
        ) {
          this.date_selected.add(this.optionsModel.hourStep, 'hour');
          this.value_set(this.date_selected);
        }
        break;
      case 'dec':
        const dateToDec = this.date_selected.clone().add(this.optionsModel.hourStep, 'hour');
        if (
          this.optionsModel.minSelectableDate &&
          dateToDec.isAfter(this.optionsModel.minSelectableDate)
        ) {
          this.date_selected.subtract(this.optionsModel.hourStep, 'hour');
          this.value_set(this.date_selected);
        }
        break;
    }
  }
  public minute_change(inc_dec: string): void {
    switch (inc_dec) {
      case 'inc':
        const dateToInc = this.date_selected.clone().add(this.optionsModel.minuteStep, 'minute');
        if (
          this.optionsModel.maxSelectableDate &&
          dateToInc.isSameOrBefore(this.optionsModel.maxSelectableDate)
        ) {
          this.date_selected.add(this.optionsModel.minuteStep, 'minute');
          this.value_set(this.date_selected);
        }
        break;
      case 'dec':
        const dateToDec = this.date_selected.clone().add(this.optionsModel.minuteStep, 'minute');
        if (
          this.optionsModel.minSelectableDate &&
          dateToDec.isAfter(this.optionsModel.minSelectableDate)
        ) {
          this.date_selected.subtract(this.optionsModel.minuteStep, 'minute');
          this.value_set(this.date_selected);
        }
        break;
    }
  }
}
