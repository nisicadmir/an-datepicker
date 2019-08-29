import { ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { IDay, IYear } from '../public_api';
import { AbstractControl, ValidationErrors } from '@angular/forms';

import * as momentImported from 'moment';
const moment = momentImported;

export abstract class AbstractDatepicker<T> {
  @Input() protected options: T = {} as T;
  public optionsModel: any = {} as any;

  @ViewChild('pickerElement', { static: false }) protected pickerElement: ElementRef;
  @ViewChild('inputElement', { static: false }) protected inputElement: ElementRef;

  @Input() protected dateDisplayFormat: string; // default 'DD.MM.YYYY', display format of date acceptable by moment
  @Input() protected dateInit: momentImported.Moment | Date | string; // date to where to init calendar
  @Input() protected placeholder: string; // placeholder when date is not selected
  @Input() protected minSelectableDate: string; // must be same format as dateDisplayFormat, minimum clickable date, will be overidden if there is dateListAllowed
  @Input() protected maxSelectableDate: string; // must be same format as dateDisplayFormat, minimum clickable date, will be overidden if there is dateListAllowed
  @Input() protected dateMinValidate: string; // must be same format as dateDisplayFormat, validate minimum date
  @Input() protected dateMaxValidate: string; // must be same format as dateDisplayFormat, validate maximum date
  @Input() protected selecableDates: momentImported.Moment[] | Date[] | string[]; // list of days which are clickable
  @Input() protected firstDayOfWeek: number; // default 0 (sunday)
  @Input() protected locale: string; // default 'en'
  @Input() protected isReadonly: boolean; // default false
  @Input() protected isDisabledInput: boolean; // default false

  // emit onClick
  // emits selected date in format dateDisplayFormat
  @Output('anDPDaySelect') anDPDaySelect: EventEmitter<
    momentImported.Moment | string
  > = new EventEmitter();

  public date_selected: momentImported.Moment;
  protected get dateSelected(): momentImported.Moment {
    return this.date_selected;
  }
  public get dateSelectedFormated(): string {
    return (
      (this.dateSelected &&
        this.optionsModel.dateDisplayFormat &&
        this.dateSelected.format(this.optionsModel.dateDisplayFormat)) ||
      ''
    );
  }

  public days: IDay[] = [];
  public day_names: string[] = [];
  public years: IYear[] = [];
  public date_selected_bar_display: any;

  protected options_interval: any;
  public opened: boolean = false; // datePicker will be closed by default
  public show_years: boolean = false; // toggle for years select
  // for position
  protected clicked_times: number = 0;
  protected local_click: boolean = false;

  /**
   * @inheritdoc
   */
  public onTouchedCallback: () => void = () => {};
  /**
   * @inheritdoc
   */
  protected onChangeCallback: (_: any) => void = () => {};

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  // get value from parent [(ngModel)] or formControl
  // can be type of moment date or ISOstring
  public writeValue(value: momentImported.Moment | Date | string) {
    if (value) this.date_selected = moment(value);
  }
  /**
   * @inheritdoc
   */
  protected validate(AC: AbstractControl): ValidationErrors | null {
    if (!this.dateSelected) {
      return;
    }
    if (
      this.optionsModel.dateMinValidate &&
      this.dateSelected.isSameOrBefore(moment(this.optionsModel.dateMinValidate))
    ) {
      return { dateMinValidateError: true };
    }
    if (
      this.optionsModel.dateMaxValidate &&
      this.dateSelected.isAfter(moment(this.optionsModel.dateMaxValidate))
    ) {
      return { dateMaxValidateError: true };
    }
  }

  protected getDateToInit(): momentImported.Moment {
    return moment(this.optionsModel.dateInit) || moment();
  }

  /**
   * Set dateSelected
   * Close datepicker
   * Emits value to output
   * Trigger onChangeCallback
   * @param val
   */
  protected value_set(val: momentImported.Moment): void {
    // get and set value
    if (val === null) {
      this.date_selected = null;
    } else {
      this.date_selected = moment(val);
    }
    this.postValueSet();
  }

  protected postValueSet(): void {
    // close datepicker
    if (this.optionsModel.onSelectClose && !this.optionsModel.isOnlyCalendar)
      this.datepicker_close();
    if (this.dateSelected === null) {
      this.triggerOnChangeAndEmit(null);
      return;
    }
    // return value to [(ngModel)] in different types and formats
    switch (this.optionsModel.dateReturnType) {
      case 'moment':
        // emit only when clicked not while writeValue
        this.triggerOnChangeAndEmit(this.dateSelected);
        break;
      case 'ISOString':
        this.triggerOnChangeAndEmit(this.dateSelected.toISOString());
        break;
      default:
        this.triggerOnChangeAndEmit(this.dateSelected.format(this.optionsModel.dateReturnType));
        break;
    }
  }

  private triggerOnChangeAndEmit(value: momentImported.Moment | string): void {
    this.onChangeCallback(value);
    this.anDPDaySelect.emit(value);
  }

  /**
   * Initialize days in month
   */
  protected init_days(): void {
    const isInDateListAllowed = (d: momentImported.Moment): boolean => {
      console.log('321', 321);
      for (const key in this.optionsModel.selectableDates) {
        if (this.optionsModel.selectableDates.hasOwnProperty(key)) {
          if (moment(this.optionsModel.selectableDates[key]).isSame(d, 'day')) {
            return true;
          }
        }
      }
      return false;
    };

    const newDayList: IDay[] = [];

    const startDay = this.getDateToInit()
      .startOf('month')
      .isoWeekday(this.optionsModel.firstDayOfWeek);
    if (startDay.date() >= 2 && startDay.date() < 10) {
      startDay.subtract(7, 'days');
    }
    const endDay = moment(startDay).add(41, 'days');
    const d = moment(startDay);
    while (d.isSameOrBefore(endDay, 'day')) {
      newDayList.push({
        day: d.date(),
        moment: moment(d),
        isToday: d.isSame(moment(), 'day'),
        isInMonth:
          d.isSameOrAfter(this.getDateToInit().startOf('month'), 'day') &&
          d.isSameOrBefore(this.getDateToInit().endOf('month'), 'day'),
        isSelected: d.isSame(this.dateSelected, 'day'),
        isSelectable:
          this.optionsModel.selectableDates && this.optionsModel.selectableDates.length
            ? isInDateListAllowed(d)
            : d.isAfter(this.optionsModel.minSelectableDate) &&
              d.isSameOrBefore(this.optionsModel.maxSelectableDate),
      });
      d.add(1, 'days');
    }
    this.days = newDayList;
    this.date_selected_bar_display = `${moment()
      .month(this.getDateToInit().month())
      .format('MMM')} ${this.getDateToInit().year()}`;
  }

  /**
   * Initialize day names in calendar
   * Locale will be taken from input, default is en
   */
  protected init_dayNames(): void {
    this.day_names = [];
    const start = this.optionsModel.firstDayOfWeek;
    for (let i = start; i <= 6 + start; i++) {
      this.day_names.push(
        moment()
          .isoWeekday(i + 7)
          .format(this.optionsModel.dayNamesFormat)
      );
    }
  }

  /**
   * Initialize years that can be selected
   */
  protected init_years(): void {
    const year_is_selectable = (year: number): boolean => {
      if (this.optionsModel.selectableDates && this.optionsModel.selectableDates.length) {
        for (const key in this.optionsModel.selectableDates) {
          if (this.optionsModel.selectableDates.hasOwnProperty(key)) {
            if (moment(this.optionsModel.selectableDates[key]).isSame(moment().year(year), 'year'))
              return true;
          }
        }
      } else {
        return (
          moment()
            .year(year)
            .isSameOrAfter(this.optionsModel.minSelectableDate, 'year') &&
          moment()
            .year(year)
            .isSameOrBefore(this.optionsModel.maxSelectableDate, 'year')
        );
      }
    };
    const range = this.optionsModel.maxYear - this.optionsModel.minYear;
    this.years = Array.from(new Array(range), (x, i) => i + this.optionsModel.minYear).map(year => {
      return {
        year: year,
        isThisYear: year === moment().year(),
        isSelectedYear: year === moment(this.getDateToInit()).year(),
        isSelectable: true,
        // isSelectable: this.year_is_selectable(year),
      };
    });
  }

  public onChangeText(value: string): void {
    if (value === '' && this.dateSelected) {
      this.value_set(null);
      return;
    }
    if (this.canSetDateOnValueChange(value)) {
      this.value_set(moment(value, this.optionsModel.dateDisplayFormat));
      this.optionsModel.dateInit = moment(value, this.optionsModel.dateDisplayFormat);
      this.init_days();
      this.init_dayNames();
      this.init_years();
    }
    this.inputElement.nativeElement.value = this.dateSelectedFormated;
  }

  private canSetDateOnValueChange(value: string): boolean {
    if (
      moment(value, this.optionsModel.dateDisplayFormat).isValid() &&
      !moment(value, this.optionsModel.dateDisplayFormat).isSame(this.dateSelected) &&
      this.optionsModel.minSelectableDate &&
      moment(value, this.optionsModel.dateDisplayFormat).isAfter(
        moment(this.optionsModel.minSelectableDate)
      ) &&
      this.optionsModel.maxSelectableDate &&
      moment(value, this.optionsModel.dateDisplayFormat).isSameOrBefore(
        moment(this.optionsModel.maxSelectableDate)
      )
    )
      return true;
  }

  public month_change(type: string): void {
    switch (type) {
      case 'inc':
        this.optionsModel.dateInit = moment(this.optionsModel.dateInit).add(1, 'months');
        this.init_days();
        break;
      case 'dec':
        this.optionsModel.dateInit = moment(this.optionsModel.dateInit).subtract(1, 'months');
        this.init_days();
        break;
    }
  }

  public year_select(year: number): void {
    this.optionsModel.dateInit = moment(this.optionsModel.dateInit).set('year', year);
    this.init_days();
    this.init_years();
    this.showYears_toggle();
  }

  public showYears_toggle(): void {
    this.show_years = !this.show_years;
  }

  protected datepicker_close(): void {
    this.opened = false;
  }

  @HostListener('click', [])
  onLocalClick() {
    this.local_click = true;
  }

  @HostListener('document:click', [])
  onGlobalClick() {
    const calendar_inner_height =
      (this.pickerElement && this.pickerElement.nativeElement.offsetHeight) || 0;
    const calendar_inner_width =
      (this.pickerElement && this.pickerElement.nativeElement.offsetWidth) || 0;
    const input_bounds =
      (this.inputElement && this.inputElement.nativeElement.getBoundingClientRect()) || 0;
    // position of pickerElement
    // only check this option if date picker is not opend
    this.clicked_times++;
    if (!this.optionsModel.isPositionFixed && this.clicked_times <= 2) {
      if (window.innerHeight < input_bounds.y + calendar_inner_height + input_bounds.height) {
        this.optionsModel.calendarPosition =
          'bottom-' + this.optionsModel.calendarPosition.split('-')[1];
      } else {
        this.optionsModel.calendarPosition =
          'top-' + this.optionsModel.calendarPosition.split('-')[1];
      }
      if (window.innerWidth < input_bounds.x + calendar_inner_width) {
        this.optionsModel.calendarPosition =
          this.optionsModel.calendarPosition.split('-')[0] + '-right';
      } else {
        this.optionsModel.calendarPosition =
          this.optionsModel.calendarPosition.split('-')[0] + '-left';
      }
    }
    if (!this.local_click && this.clicked_times >= 2) {
      this.datepicker_close();
      this.clicked_times = 0;
    }
    this.local_click = false;
  }
}
