import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { EscPosPrintModule } from 'ng-thermal-print';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    EscPosPrintModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
