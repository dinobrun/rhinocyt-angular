import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatListModule,
  MatIconModule,
  MatGridListModule,
  MatMenuModule,
  MatCardModule,
  MatToolbarModule,
  MatSidenavModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatTabsModule
} from '@angular/material';

import { NgModule } from '@angular/core';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatGridListModule,
    MatMenuModule,
    MatCheckboxModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTabsModule
  ],
  exports: [
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatGridListModule,
    MatMenuModule,
    MatCheckboxModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTabsModule
  ]
})
export class MaterialModule {}
