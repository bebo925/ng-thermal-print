import { EscPosPrintService } from './../../projects/ng-thermal-print/src/lib/ng-thermal-print.service';
import { UsbDriver } from '../../projects/ng-thermal-print/src/lib/drivers';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  status: boolean = false;
  usbPrintDriver = new UsbDriver(1046, 20497);

  constructor(private printService: EscPosPrintService) {
    this.printService.isConnected.subscribe(result => {
      this.status = result;
      if (result) {
        console.log('connected printer from app');
      } else {
        console.log('not connected');
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
