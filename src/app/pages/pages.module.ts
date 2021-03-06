import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { LogoutComponent } from './../auth/logout/logout.component';
import { UploadDataModule } from './upload-data/upload-data.module';
import { AddTutoresModule } from './add-tutores/add-tutores.module';
//import { UploadalumnosModule } from './uploadalumnos/uploadalumnos.module';


@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    UploadDataModule,
    AddTutoresModule,
    //UploadalumnosModule,
  ],
  declarations: [
    PagesComponent,
    LogoutComponent
  ],
})
export class PagesModule {
}
