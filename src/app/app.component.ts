import { PrintService, UsbDriver } from 'ng-thermal-print';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  status: boolean = false;

  constructor(private printService: PrintService) {
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
