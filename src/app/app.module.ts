import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ThermalPrintModule } from 'ng-thermal-print';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ThermalPrintModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
