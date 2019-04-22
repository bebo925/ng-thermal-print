# PrintLib

A library for connecting Angular apps with thermal printers.

## Drivers

1. WEBUSB API (No drivers needed. Only works with Chrome and Opera with USB connection)
2. WebPRNT (http)

## Print Language Drivers

1. ESC/POS
2. StarPRNT
3. Star WebPRNT


## Installation

`npm install ng-thermal-print`

Import the module into your app:

    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { ThermalPrintModule } from 'ng-thermal-print'; //add this line
    import { AppComponent } from './app.component';

    @NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        ThermalPrintModule //add this line
    ],
    providers: [],
    bootstrap: [AppComponent]
    })
    export class AppModule { }

## Examples

### WebUSB API


    import { PrintService, UsbDriver } from 'ng-thermal-print';
    import { Component } from '@angular/core';

    @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
    export class AppComponent {
        constructor(private printService: PrintService) {
            this.printService.isConnected.subscribe(result => {
                if (result) {
                    console.log('Connected to printer!');
                } else {
                    console.log('Not Connected!');
                }
            });
        }

        requestUsb() {
            // this must be called from an event to work
            let usbPrintDriver = new UsbDriver();
            usbPrintDriver.requestUsb().then(result => {
                this.printService.setDriver(usbPrintDriver);
            });
        }

        writeToUsb() {
            this.printService.init()
                .setBold(true)
                .writeLine('Hello World!')
                .setBold(false)
                .feed(4)
                .cut('full')
                .flush();
        }
    }
