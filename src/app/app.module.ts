import { AllTagsComponent } from './all-tags/all-tags.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { AgGridModule } from 'ag-grid-angular';
import { RecountComponent } from './recount/recount.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgLocationsComponent } from './ag-locations/ag-locations.component';
import { AgUncountedComponent } from './ag-uncounted/ag-uncounted.component';
import { MenuComponent } from './menu/menu.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { MatSliderModule, MatInputModule, MatButtonModule,
  MatSelectModule,  MatSidenavModule, MatIconModule,
  MatMenuModule, MatSnackBarModule, MatCheckboxModule,
MatToolbarModule, MatProgressBarModule } from '@angular/material';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    AllTagsComponent,
    RecountComponent,
    AgLocationsComponent,
    AgUncountedComponent,
    MenuComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule.withComponents([]),
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
