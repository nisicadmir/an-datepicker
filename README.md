# Datepicker for Angular8+ application

# Installation:

1. Download from npm:

```
npm install an-datepicker --save
```

2. Import the AnDatepickerModule module in your module:

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AnDatepickerModule } from 'an-datepicker';

@NgModule({
  imports: [
    BrowserModule,
    AnDatepickerModule, // <--
  ],
  declarations: [AppComponent],
  exports: [AppComponent],
})
export class AppModule {}
```

# Options for DatePicker

```typescript
import { IDatepickerOptions } from 'an-datepicker';
options: IDatepickerOptions = {
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
  onSelectClose?: boolean; // close datePicker when value is selected
}
```

# Options for DatetimePicker

```typescript
import { IDatetimepickerOptions } from 'an-datepicker';
options: IDatetimepickerOptions = {
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
  onSelectClose?: boolean; // close datePicker when value is selected

  hourStep?: number;
  minuteStep?: number;
  showMeridiem?: boolean;
}
```

# Options as inputs

1. Datepicker

```javascript
  // all input fields are optional, if changes occur on input, datepicker will detect changes and reinitialize datepicker
  @Input() options: IDatepickerOptions;
  @Input() dateDisplayFormat: string; // default 'dd.MM.yyyy', display format of date acceptable by moment
  @Input() dateInit: momentImported.Moment | Date | string; // date to where to init calendar
  @Input() placeholder: string; // placeholder when date is not selected
  @Input() minSelectableDate: string; // must be same format as dateDisplayFormat, minimum clickable date, will be overidden if there is dateListAllowed
  @Input() maxSelectableDate: string; // must be same format as dateDisplayFormat, minimum clickable date, will be overidden if there is dateListAllowed
  @Input() dateMinValidate: string; // must be same format as dateDisplayFormat, validate minimum date
  @Input() dateMaxValidate: string; // must be same format as dateDisplayFormat, validate maximum date
  @Input() selecableDates: momentImported.Moment[] | Date[] | string[]; // list of days which are clickable
  @Input() firstDayOfWeek: number; // default 0 (sunday)
  @Input() locale: string; // default 'en'
  @Input() isReadonly: boolean; // default false
  @Input() isDisabledInput: boolean; // default false

  // output
  @Output('anDPDaySelect') anDPDaySelect: EventEmitter<moment.Moment | string> = new EventEmitter(); // emits selected date in format dateDisplayFormat
```

1. DatetimePicker

```javascript
  // all input fields are optional, if changes occur on input, datepicker will detect changes and reinitialize datepicker
  @Input() options: IDatetimepickerOptions;
  @Input() dateDisplayFormat: string; // default 'dd.MM.yyyy', display format of date acceptable by moment
  @Input() dateInit: momentImported.Moment | Date | string; // date to where to init calendar
  @Input() placeholder: string; // placeholder when date is not selected
  @Input() minSelectableDate: string; // must be same format as dateDisplayFormat, minimum clickable date, will be overidden if there is dateListAllowed
  @Input() maxSelectableDate: string; // must be same format as dateDisplayFormat, minimum clickable date, will be overidden if there is dateListAllowed
  @Input() dateMinValidate: string; // must be same format as dateDisplayFormat, validate minimum date
  @Input() dateMaxValidate: string; // must be same format as dateDisplayFormat, validate maximum date
  @Input() selecableDates: momentImported.Moment[] | Date[] | string[]; // list of days which are clickable
  @Input() firstDayOfWeek: number; // default 0 (sunday)
  @Input() locale: string; // default 'en'
  @Input() isReadonly: boolean; // default false
  @Input() isDisabledInput: boolean; // default false
  @Input() hourStep: number; // step when changing hour, default 1
  @Input() minuteStep: number; // step when changing minute, default 5
  @Input() showMeridiem: boolean; // show meridiem or not, default false
  // output
  @Output('anDPDaySelect') anDPDaySelect: EventEmitter<moment.Moment | string> = new EventEmitter(); // emits selected date in format dateDisplayFormat
```

# Usage

## Reactive forms (datepicker)

```html
<form [formGroup]="form" (ngSubmit)="form_submit()">
  <an-datepicker
    (anDPDaySelect)="onClick($event)"
    [firstDayOfWeek]="1"
    formControlName="date"
    [dateMinValidate]="'20.09.2019'"
    [dateMaxValidate]="'22.09.2019'"
    [minSelectableDate]="'20.09.2019'"
    [maxSelectableDate]="'22.09.2019'"
  >
  </an-datepicker>
  <span *ngIf="form.get('date').hasError('required')">error required</span>
  <span *ngIf="form.get('date').hasError('dateMinValidateError')">error</span>
  <span *ngIf="form.get('date').touched">Touched</span>
</form>
```

## NgModel (datetimepicker)

```html
<an-datetimepicker [options]="options" [dateMin]="date_min2" [(ngModel)]="d"></an-datetimepicker>
```
