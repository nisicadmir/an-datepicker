import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AnDatepickerComponent } from './an-datepicker/an-datepicker.component';
// import { AnMonthpickerComponent } from './an-monthpicker/an-monthpicker.component';
// import { AnWeekpickerComponent } from './an-weekpicker/an-weekpicker.component';
import { AnDatetimepickerComponent } from './an-datetimepicker/an-datetimepicker.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [AnDatepickerComponent, AnDatetimepickerComponent],
  exports: [AnDatepickerComponent, AnDatetimepickerComponent],
})
export class AnDatepickerModule {}
