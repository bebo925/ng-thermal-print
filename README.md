
# Angular Thermal Printer Library

A library for connecting Angular apps with thermal printers (type ESC/POS or Star models).

## Drivers

1. WebUSB API (No drivers needed. Works only with Chrome, Edge and Opera with direct USB connection).

Why Chrome, Edge and Opera only? The USB interface of the WebUSB API provides attributes and methods for finding and connecting USB devices from a web page, but it is an experimental technology (that works, indeed) implemented only in Chromium-based browsers.

2. WebPRNT (http, Star printers only)

What is WebPRNT? The Star Company developed WebPRNT™ solution, that is designed to generate print data via a web browser to output directly to any Star printer fitted with a WebPRNT interface or using Star’s WebPRNT Browser Software. This includes Star thermal receipt, ticket & label printers as well as SP700 matrix kitchen printer. So, this remote printing technology will work only with Star printers.

## Developers important note

If you are getting this error when trying to get USB devices in your remote server (maybe production server):
`Cannot read property 'requestDevice' of undefined at Observable._subscribe (ng-thermal-print.js:1037)`
but all is running right in localhost, the official docs about **USB.requestDevice()** says: _This feature is available only in secure contexts (HTTPS)_
So you need to set your remote server to use HTTPS (you need to get a certificate, e.g. from https://letsencrypt.org/). It works in localhost because it is a "secure" place too.

## Print Language Drivers

1. ESC/POS (de-facto standard for POS printers. Epson based language).
2. StarPRNT (printers from Star brand).
3. Star WebPRNT (proprietary protocol for Star printers).

## Installation

Install library

`npm install ng-thermal-print`

NOTE: if when compiling project you get an error like this:
`ERROR in node_modules/ng-thermal-print/lib/drivers/UsbDriver.d.ts:16:30 - error TS2304: Cannot find name 'USBDevice'. requestUsb(): Observable;`
then add reference to w3c-web-usb by installing it with command: `npm install @types/w3c-web-usb --only=dev`

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

## Available methods

* setDriver(driver: PrintDriver, printLanguage?: string);
* init();
* cut(cutType?: string); // full|partial
* feed(lineCount?: number);
* setInverse(value?: boolean);
* setBold(value?: boolean);
* setUnderline(value?: boolean);
* setJustification(value?: string); // left|center|right
* setSize(value?: string); // normal|large
* writeLine(text?: string);
* flush(); // write the current builder value to the driver and clear out the builder

## Advanced features

The above example is really simple and shows the main options. But, probably, you don't want the user to select the printer everytime he wants to print. To avoid it, you can save the printer the first time user selects it, and recover it next time:

So, the first time you do this:
  
    requestPrinter() {
        this.usbDriver.requestUsb().subscribe((result) => {
          let language = (result.vendorId === 1305) ? 'StarPRNT' : 'ESC/POS';
          localStorage.setItem('printer-device', JSON.stringify({ vendorId: result.vendorId, productId: result.productId }));
          this.printService.setDriver(new UsbDriver(result.vendorId, result.productId), language);
        });
    }

And next time, you recover it:

    if (localStorage.getItem('printer-device')) {
        const device = JSON.parse(localStorage.getItem('printer-device'));
        this.usbDriver = new UsbDriver(device.vendorId, device.productId);
        let language = (device.vendorId === 1305) ? 'StarPRNT' : 'ESC/POS';
        this.printService.setDriver(this.usbDriver, language);
    }
    
## Problems with WebUSB

WebUSB specification is still in progress, so you can get problems with later implementations. The main problem I found is that Windows can "reclaim" your printer if you install certified drivers, making your printer invisible to WebUSB call `requestUsb()` (so, you can't choose it to connect). In that case, a program called Zadig (https://zadig.akeo.ie/) will let you to "free" the printer by changing the current "proprietary" printer driver to the standart WinUSB driver. After that change, printer will be available in the list.

Another (little) problem is that only one browser can be connected to the printer, so for example, if you open normal Chrome and incognito mode, only one will be able to connect to printer.
