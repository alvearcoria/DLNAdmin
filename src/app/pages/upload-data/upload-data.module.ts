import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadDataComponent } from './upload-data.component';
import {NbButtonModule, NbCardModule, NbSpinnerModule, NbRadioModule, NbIconModule, NbInputModule, NbSelectModule, NbAlertModule, NbCheckboxModule, NbDatepickerModule, NbTabsetModule, NbAccordionModule, NbBadgeModule, NbActionsModule} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  declarations: [UploadDataComponent],
  imports: [

    CommonModule,
    NbAlertModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbCardModule,
    NbSelectModule,
    NbSpinnerModule,
    NbRadioModule,
    NbCheckboxModule,
    NbDatepickerModule, NbTabsetModule, NbAccordionModule, NbBadgeModule, NbActionsModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
  ]
})
export class UploadDataModule { }
