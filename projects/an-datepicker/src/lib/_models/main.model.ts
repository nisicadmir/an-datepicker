import * as momentImported from 'moment';
const moment = momentImported;
export class OptionsBase {
  dateDisplayFormat: string;
  placeholder: string;
  dateInit: momentImported.Moment | Date | string;
  minSelectableDate: momentImported.Moment | Date | string;
  maxSelectableDate: momentImported.Moment | Date | string;
  dateMinValidate: momentImported.Moment | Date | string;
  dateMaxValidate: momentImported.Moment | Date | string;
  selectableDates: momentImported.Moment[] | Date[] | string[];
  firstDayOfWeek: number;
  locale: string;
  isReadonly: boolean;
  isInputDisabled: boolean;
  // input ends here
  minYear: number;
  maxYear: number;
  dateReturnType: string;
  dayNamesFormat: string;
  isOnlyCalendar: boolean;
  calendarPosition: string;
  isPositionFixed: boolean; // calculated on calendar position
  calendarWidth: string;
  calendarPadding: string;
  inputWidth: string;
  inputHeight: number;
  dayWidthHeight: number;
  dayBorderRadius: string;
  inputId: string;
  inputClass: string;
  // options interface ends here
  calculatedWidth: number;
  constructor(
    dateDisplayFormat: string,
    placeholder: string,
    dateInit: momentImported.Moment | Date | string,
    minSelectableDate: string,
    maxSelectableDate: string,
    dateMinValidate: string,
    dateMaxValidate: string,
    selectableDates: momentImported.Moment[] | Date[] | string[],
    firstDayOfWeek: number,
    locale: string,
    isReadonly: boolean,
    isInputDisabled: boolean,
    //
    minYear: number,
    maxYear: number,
    dateReturnType: string,
    dayNamesFormat: string,
    isOnlyCalendar: boolean,
    calendarPosition: string,
    isPositionFixed: boolean, // get calculated
    calendarWidth: string,
    calendarPadding: string,
    inputWidth: string,
    inputHeight: number,
    dayBorderRadius: string,
    inputId: string,
    inputClass: string,
    calculatedWidth: number
  ) {
    this.dateDisplayFormat = dateDisplayFormat;
    this.placeholder = placeholder || dateDisplayFormat;
    this.dateInit = (dateInit && moment(dateInit).clone()) || moment();
    this.minSelectableDate =
      (minSelectableDate &&
        moment(minSelectableDate, dateDisplayFormat).isValid() &&
        moment(minSelectableDate, dateDisplayFormat)) ||
      moment().subtract(50, 'years');
    this.maxSelectableDate =
      (maxSelectableDate &&
        moment(maxSelectableDate, dateDisplayFormat).isValid() &&
        moment(maxSelectableDate, dateDisplayFormat)) ||
      moment().add(50, 'years');
    this.dateMinValidate =
      (dateMinValidate && moment(dateMinValidate, this.dateDisplayFormat)) || null;
    this.dateMaxValidate =
      (dateMaxValidate && moment(dateMaxValidate, this.dateDisplayFormat)) || null;
    this.selectableDates = selectableDates || [];
    this.firstDayOfWeek = firstDayOfWeek || 0;
    this.locale = locale || 'en';
    this.isReadonly = isReadonly;
    this.isInputDisabled = isInputDisabled;
    // inputs ends here
    this.minYear =
      minYear ||
      moment()
        .subtract(30, 'years')
        .get('year');
    this.maxYear =
      maxYear ||
      moment()
        .add(30, 'years')
        .get('year');
    this.dateReturnType = dateReturnType || 'ISOString';
    this.dayNamesFormat = dayNamesFormat || 'dd';
    this.isOnlyCalendar = isOnlyCalendar;
    this.calendarPosition =
      (Object.values(PositionsAvailable).indexOf(calendarPosition) !== -1 && calendarPosition) ||
      PositionsAvailable.topLeft;
    this.isPositionFixed = isPositionFixed;
    this.calendarWidth = calendarWidth || '290px';
    this.calendarPadding = calendarPadding || '10px 5px';
    this.inputWidth = inputWidth || '200px';
    this.inputHeight = inputHeight || 30;
    this.dayWidthHeight = this.dayWidthHeight || 30;
    this.dayBorderRadius = dayBorderRadius || '0';
    this.inputId = inputId || '';
    this.inputClass = inputClass || '';
    this.calculatedWidth = calculatedWidth;
  }
}
export class DatepickerOptions extends OptionsBase {
  onSelectClose: boolean;

  constructor(
    dateDisplayFormat: string,
    placeholder: string,
    dateInit: momentImported.Moment | Date | string,
    minSelectableDate: string,
    maxSelectableDate: string,
    dateMinValidate: string,
    dateMaxValidate: string,
    selectableDates: momentImported.Moment[] | Date[] | string[],
    firstDayOfWeek: number,
    locale: string,
    isReadonly: boolean,
    isInputDisabled: boolean,
    //
    minYear: number,
    maxYear: number,
    dateReturnType: string,
    dayNamesFormat: string,
    isOnlyCalendar: boolean,
    calendarPosition: string,
    isPositionFixed: boolean,
    calendarWidth: string,
    calendarPadding: string,
    inputWidth: string,
    inputHeight: number,
    dayWidthHeight: number,
    dayBorderRadius: string,
    inputId: string,
    inputClass: string,
    //
    calculatedWidth: number,
    onSelectClose: boolean
  ) {
    super(
      dateDisplayFormat,
      placeholder,
      dateInit,
      minSelectableDate,
      maxSelectableDate,
      dateMinValidate,
      dateMaxValidate,
      selectableDates,
      firstDayOfWeek,
      locale,
      isReadonly,
      isInputDisabled,
      minYear,
      maxYear,
      dateReturnType,
      dayNamesFormat,
      isOnlyCalendar,
      calendarPosition,
      isPositionFixed,
      calendarWidth,
      calendarPadding,
      inputWidth,
      inputHeight,
      dayBorderRadius,
      inputId,
      inputClass,
      calculatedWidth
    );

    this.onSelectClose = onSelectClose === false ? false : true;
  }
}
export class DatetimepickerOptions extends OptionsBase {
  hourStep: number;
  minuteStep: number;
  showMeridiem: boolean;
  constructor(
    dateDisplayFormat: string,
    placeholder: string,
    dateInit: momentImported.Moment | Date | string,
    minSelectableDate: string,
    maxSelectableDate: string,
    dateMinValidate: string,
    dateMaxValidate: string,
    selectableDates: momentImported.Moment[] | Date[] | string[],
    firstDayOfWeek: number,
    locale: string,
    isReadonly: boolean,
    isInputDisabled: boolean,
    //
    minYear: number,
    maxYear: number,
    dateReturnType: string,
    dayNamesFormat: string,
    isOnlyCalendar: boolean,
    calendarPosition: string,
    isPositionFixed: boolean,
    calendarWidth: string,
    calendarPadding: string,
    inputWidth: string,
    inputHeight: number,
    dayWidthHeight: number,
    dayBorderRadius: string,
    inputId: string,
    inputClass: string,
    //
    calculatedWidth: number,

    hourStep: number,
    minuteStep: number,
    showMeridiem: boolean
  ) {
    super(
      dateDisplayFormat,
      placeholder,
      dateInit,
      minSelectableDate,
      maxSelectableDate,
      dateMinValidate,
      dateMaxValidate,
      selectableDates,
      firstDayOfWeek,
      locale,
      isReadonly,
      isInputDisabled,
      minYear,
      maxYear,
      dateReturnType,
      dayNamesFormat,
      isOnlyCalendar,
      calendarPosition,
      isPositionFixed,
      calendarWidth,
      calendarPadding,
      inputWidth,
      inputHeight,
      dayBorderRadius,
      inputId,
      inputClass,
      calculatedWidth
    );
    this.hourStep = hourStep || 1;
    this.minuteStep = minuteStep || 5;
    this.showMeridiem = showMeridiem;
  }
}

export interface IOptionsBase {
  minYear?: number; // minimum year for years list // default: current year - 30
  maxYear?: number; // maximum year for years list // default: current year + 30

  dateReturnType?: string; // any format acceptable by moment (ex: YYYY-MM-DD) default: ISOString
  dayNamesFormat?: string; // default 'dd'

  isOnlyCalendar?: boolean; // show only calendar without input field

  calendarPosition?: string; // position of calendar, default 'top-left', other: 'top-right', 'bottom-left', 'bottom-right'
  calendarWidth?: string; // width of calendar
  calendarPadding?: string; // padding of calendar, default 10px 5px
  inputWidth?: string; // input width, default '290px'
  inputHeight?: number; // default 30
  dayWidthHeight?: number; // height and width of day in calendar in px, default '30'
  dayBorderRadius?: string; // border radius of day in calendar, default '0'
  inputId?: string; // id of input field
  inputClass?: string; // add class to input
}
export interface IDatepickerOptions extends IOptionsBase {
  onSelectClose?: boolean; // close datePicker when value is selected
}
export interface IDatetimepickerOptions extends IOptionsBase {
  hourStep?: number; // default 1
  minuteStep?: number; // default 5
  showMeridiem?: boolean; // default false
}
export interface IWeekpickerOptions extends IOptionsBase {
  weekCalendarHeight?: string; // height of calendar
  weekNumberWidth?: string; // height of calendar
}
export interface IDay {
  day: number;
  moment: momentImported.Moment;
  isToday: boolean;
  isInMonth: boolean;
  isSelected: boolean;
  isSelectable: boolean;
}
export interface IWeek {
  week: number;
  moment: momentImported.Moment;
  days: number[];
  isWeek: boolean;
  isSelected: boolean;
  isSelectable: boolean;
}
export interface IYear {
  year: number;
  isThisYear: boolean;
  isSelectedYear: boolean;
  isSelectable: boolean;
}

export enum PositionsAvailable {
  topLeft = 'top-left',
  topRight = 'top-right',
  bottomLeft = 'bottom-left',
  bottomRight = 'bottom-right',
}
