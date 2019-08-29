import {
  Component,
  OnInit,
  forwardRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  SimpleChanges,
  HostListener,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, AbstractControl, ValidationErrors } from '@angular/forms';

import { WeekPickerOptions, WeekInterface, YearInterface } from '../_models/main.model';
import variables from '../_utils/variables';

import * as momentImported from 'moment';
const moment = momentImported;

@Component({
  selector: 'an-weekpicker',
  templateUrl: './an-weekpicker.component.html',
  styleUrls: ['./an-weekpicker.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AnWeekpickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AnWeekpickerComponent),
      multi: true,
    },
  ],
})
export class AnWeekpickerComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('pickerElement', { static: true }) private pickerElement: ElementRef;
  @ViewChild('inputElement', { static: true }) private inputElement: ElementRef;

  @Input() private options: WeekPickerOptions;
  private options_interval: any;

  @Input() private placeholder: string;
  @Input() private dateInit: momentImported.Moment | Date | string;
  @Input() private locale: string;
  @Input() private dateMin: momentImported.Moment | Date | string; // minimum clickable date, will be overidden if there is dateListAllowed
  @Input() private dateMax: momentImported.Moment | Date | string; // minimum clickable date, will be overidden if there is dateListAllowed
  @Input() private dateMinValidate: momentImported.Moment | Date | string; // validate minimum date
  @Input() private firstDayOfWeek: number; // default 0 (sunday)

  // emit onClick
  @Output('anDPWeekSelect') anDPWeekSelect: EventEmitter<momentImported.Moment | string> = new EventEmitter();
  public placeholder_val: string = '';
  //
  public opened = false; // monthPicker will be closed by default
  public show_years: boolean; // toggle for years select

  private date_init: any; // on which date to open datePicker and to init options, days, weeks, years

  public date_selected: momentImported.Moment;
  private date_returned_display_format: string;

  public date_selected_bar_display: any;

  private year_min: number;
  private year_max: number;

  private date_min: momentImported.Moment | Date | string;
  private date_max: momentImported.Moment | Date | string;

  public weeks: WeekInterface[] = [];

  public day_names: string[] = [];
  private day_names_format: string;
  public years: YearInterface[];

  private first_day_of_week: number;

  public only_calendar: boolean;

  private on_select_close: boolean;

  private position_available = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];
  public position: string;
  private position_fixed: boolean;
  public calendar_width: string;
  public calendar_padding: string;
  public week_calendar_height: string;
  public week_number_width: string;
  public input_width: string;
  public input_height: number;
  public input_id: string;

  public add_class: string;

  public is_readonly: boolean;

  // for position
  private clicked_times: number = 0;
  private local_click: boolean = false;

  public onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  value_get(): momentImported.Moment {
    return this.date_selected;
  }
  value_set(val: momentImported.Moment, type) {
    // get and set value
    this.date_selected = moment(val);

    // close datepicker
    if (this.on_select_close && !this.only_calendar) this.datepicker_close();
    // return value to [(ngModel)] in different types and formats
    switch (this.date_returned_display_format) {
      case 'moment':
        // emit only when clicked not while writeValue
        this.onChangeCallback(this.date_selected);
        if (!type) {
          this.anDPWeekSelect.emit(this.date_selected);
        }
        break;
      case 'ISOString':
        this.onChangeCallback(this.date_selected.toISOString());
        if (!type) {
          this.anDPWeekSelect.emit(this.date_selected.toISOString());
        }
        break;
      default:
        this.onChangeCallback(this.date_selected.format(this.date_returned_display_format));
        if (!type) {
          this.anDPWeekSelect.emit(this.date_selected.format(this.date_returned_display_format));
        }
        break;
    }
    this.init_weeks();
  }
  constructor() {}

  ngOnInit() {
    this.init_all();
  }
  ngOnDestroy() {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.options_interval = setTimeout(() => {
        clearTimeout(this.options_interval);
        this.init_all();
      }, variables.init_options_interval);
    }
  }
  // get value from parent [(ngModel)] or formControl
  // can be type of moment date or ISOstring
  writeValue(value: momentImported.Moment | Date | string) {
    if (value) {
      this.value_set(moment(value), 'init');
    }
  }
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  init_options(): void {
    const today = moment();
    this.year_min =
      (this.options && this.options.yearMin) ||
      moment(today)
        .subtract(30, 'years')
        .get('year');
    this.year_max =
      (this.options && this.options.yearMax) ||
      moment(today)
        .add(30, 'years')
        .get('year');
    this.placeholder_val = this.placeholder || '';
    // init must be type of moment, Date or ISOString
    this.date_init = (this.dateInit && moment(this.dateInit).clone()) || (this.date_selected && this.date_selected.clone()) || moment();

    this.date_min = this.dateMin || moment().subtract(10, 'year');
    this.date_max = this.dateMax || moment().add(10, 'year');

    this.date_returned_display_format =
      (this.options.dateReturnedDisplayFormat && this.options.dateReturnedDisplayFormat.toUpperCase()) || 'ISOString';
    this.first_day_of_week = this.firstDayOfWeek || this.options.firstDayOfWeek || 0;
    this.day_names_format = this.options.dayNamesFormat || 'dd';

    this.only_calendar = this.options.onlyCalendar || false;

    this.on_select_close = this.options.onSelectClose || true;

    this.position = (this.position_available.indexOf(this.options.position) !== -1 && this.options.position) || 'top-left';
    this.position_fixed = this.options.position ? true : false;
    this.calendar_width = this.options.calendarWidth || '290px';
    this.calendar_padding = this.options.calendarPadding || '10px 5px';
    this.week_calendar_height = this.options.weekCalendarHeight || '30px';
    this.week_number_width = this.options.weekNumberWidth || '30px';
    this.input_width = this.options.inputWidth || '200px';
    this.input_height = this.options.inputHeight || 30;
    this.input_id = this.options.inputId || '';
    this.add_class = this.options.addClass || '';

    this.is_readonly = this.options.readonly;

    moment.locale(this.locale || 'en');
  }

  private init_weeks(): void {
    const daysInWeek_get = (date: momentImported.Moment): number[] => {
      const d = moment(date).clone();
      const days: number[] = [];
      for (let i = 0; i < 7; i++) {
        days.push(d.date());
        d.add(1, 'days');
      }
      return days;
    };
    // end of functions
    this.weeks = [];
    const startDay = moment(this.date_init)
      .startOf('month')
      .isoWeekday(this.first_day_of_week);
    if (startDay.date() >= 2 && startDay.date() < 10) {
      startDay.subtract(7, 'days');
    }
    const endDay = moment(startDay)
      .add(41, 'days')
      .isoWeekday(this.first_day_of_week);

    const d = moment(startDay);
    while (d.isSameOrBefore(endDay, 'day')) {
      this.weeks.push({
        week: this.weekNumber_get(d),
        moment: moment(d),
        days: daysInWeek_get(d),
        isWeek: this.weekNumber_get(d) === this.weekNumber_get(moment()) && d.year() === moment().year(),
        isSelected: this.weekNumber_get(d) === this.weekNumber_get(this.date_selected) && d.year() === moment(this.date_selected).year(),
        isSelectable: d.isAfter(this.date_min, 'day') && d.isSameOrBefore(this.date_max, 'day'),
      });
      d.add(1, 'week');
    }

    this.date_selected_bar_display = `${moment()
      .month(this.date_init.month())
      .format('MMM')} ${this.date_init.year()}`;
  }
  private weekNumber_get = (date: momentImported.Moment): number => {
    switch (this.first_day_of_week) {
      case 0:
        return moment(date)
          .subtract(6, 'days')
          .isoWeek();
      case 6:
        return moment(date)
          .subtract(5, 'days')
          .isoWeek();
      case 5:
        return moment(date)
          .subtract(4, 'days')
          .isoWeek();
      case 4:
        return moment(date)
          .subtract(3, 'days')
          .isoWeek();
      case 3:
        return moment(date)
          .subtract(2, 'days')
          .isoWeek();
      case 2:
        return moment(date)
          .subtract(1, 'days')
          .isoWeek();
      case 1:
        return moment(date).isoWeek();
    }
  };

  private init_years(): void {
    const range = this.year_max - this.year_min;
    this.years = Array.from(new Array(range), (x, i) => i + this.year_min).map(year => {
      return {
        year: year,
        isThisYear: year === moment().year(),
        isSelectedYear: year === moment(this.date_init).year(),
        isSelectable:
          moment()
            .year(year)
            .isSameOrAfter(this.date_min, 'year') &&
          moment()
            .year(year)
            .isSameOrBefore(this.date_max, 'year'),
      };
    });
  }

  private init_daynames(): void {
    this.day_names = [];
    const start = this.first_day_of_week;
    for (let i = start; i <= 6 + start; i++) {
      this.day_names.push(
        moment()
          .isoWeekday(i + 7)
          .format(this.day_names_format)
      );
    }
  }

  private init_all(): void {
    this.init_options();
    this.init_weeks();
    this.init_years();
    this.init_daynames();
  }

  public valuDate_set(day: momentImported.Moment): void {
    this.value_set(day, null);
  }

  public value_selected_get(): string {
    if (this.date_selected) return `${this.weekNumber_get(this.date_selected)} ${this.date_selected.year()}`;
  }

  public month_change(type): void {
    switch (type) {
      case 'inc':
        this.date_init = moment(this.date_init).add(1, 'months');
        this.init_weeks();
        break;
      case 'dec':
        this.date_init = moment(this.date_init).subtract(1, 'months');
        this.init_weeks();
        break;
    }
  }

  public year_select(year): void {
    this.date_init = moment(this.date_init).set('year', year);
    this.init_weeks();
    this.init_years();
    this.showYears_toggle();
  }

  public showYears_toggle(): void {
    this.show_years = !this.show_years;
  }

  public datepicker_toggle(): void {
    this.opened = !this.opened;
    this.clicked_times = 0;
  }

  private datepicker_close(): void {
    this.opened = false;
  }

  private validate(AC: AbstractControl): ValidationErrors | null {
    if (!this.date_selected || !this.dateMinValidate) {
      return;
    }
    const date_min_validate = moment(this.dateMinValidate);
    if (this.date_selected.isSameOrBefore(date_min_validate, 'day')) {
      return { dateMinValidateError: true };
    } else {
      return null;
    }
  }

  @HostListener('click', [])
  onLocalClick() {
    this.local_click = true;
  }

  @HostListener('document:click', [])
  onGlobalClick() {
    const calendar_inner_height = (this.pickerElement && this.pickerElement.nativeElement.offsetHeight) || 0;
    const calendar_inner_width = (this.pickerElement && this.pickerElement.nativeElement.offsetWidth) || 0;
    const input_bounds = (this.inputElement && this.inputElement.nativeElement.getBoundingClientRect()) || 0;
    // position of pickerElement
    // only check this option if date picker is not opend
    this.clicked_times++;
    if (!this.position_fixed && this.clicked_times <= 2) {
      if (window.innerHeight < input_bounds.y + calendar_inner_height + input_bounds.height) {
        this.position = 'bottom-' + this.position.split('-')[1];
      } else {
        this.position = 'top-' + this.position.split('-')[1];
      }
      if (window.innerWidth < input_bounds.x + calendar_inner_width) {
        this.position = this.position.split('-')[0] + '-right';
      } else {
        this.position = this.position.split('-')[0] + '-left';
      }
    }
    if (!this.local_click && this.clicked_times >= 2) {
      this.datepicker_close();
      this.clicked_times = 0;
    }
    this.local_click = false;
  }
}
