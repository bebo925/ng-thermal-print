
# Angular Thermal Printer Library

A library for connecting Angular apps with thermal printers.

## Drivers

1. WEBUSB API (No drivers needed. Only works with Chrome and Opera with USB connection)

2. WebPRNT (http)

## Print Language Drivers

1. ESC/POS

2. StarPRNT

3. Star WebPRNT

## Installation

Install library

`npm install ng-thermal-print`

Import into your application

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

## Example Usage

app.component.ts

    import { PrintService, UsbDriver, WebPrintDriver } from 'ng-thermal-print';
    import { Component } from '@angular/core';
    import { PrintDriver } from 'ng-thermal-print/lib/drivers/PrintDriver';

    @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
    export class AppComponent {
        status: boolean = false;
        usbPrintDriver: UsbDriver;
        webPrintDriver: WebPrintDriver;
        ip: string = '';

        constructor(private printService: PrintService) {
            this.usbPrintDriver = new UsbDriver();
            this.printService.isConnected.subscribe(result => {
                this.status = result;
                if (result) {
                    console.log('Connected to printer!!!');
                } else {
                console.log('Not connected to printer.');
                }
            });
        }

        requestUsb() {
            this.usbPrintDriver.requestUsb().subscribe(result => {
                this.printService.setDriver(this.usbPrintDriver, 'ESC/POS');
            });
        }

        connectToWebPrint() {
            this.webPrintDriver = new WebPrintDriver(this.ip);
            this.printService.setDriver(this.webPrintDriver, 'WebPRNT');
        }

        print(driver: PrintDriver) {
            this.printService.init()
                .setBold(true)
                .writeLine('Hello World!')
                .setBold(false)
                .feed(4)
                .cut('full')
                .flush();
        }
    }

app.component.html

    <strong>Status: {{status}}</strong>
    <div>
        <input [(ngModel)]="ip" type="text" name="ip" placeholder="IP of printer with WebPRNT">
        <button (click)="connectToWebPrint()">Connect to WebPRNT</button>
    </div>

    <div>
        <button (click)="requestUsb()">Connect to USB</button>
    </div>

    <div>
        <button (click)="print()" [disabled]="status === false"> Print!</button>
    </div>
