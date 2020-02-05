import { PrintService, UsbDriver, WebPrintDriver, BluetoothDriver } from 'ng-thermal-print';
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
  bluetoothDriver: BluetoothDriver;
  ip: string = '10.83.118.160';

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
      this.printService.setDriver(this.usbPrintDriver);
    }, error => {
      console.log(error);
    });
  }

  requestBluetooth() {
    this.bluetoothDriver = new BluetoothDriver();
    this.bluetoothDriver.requestForBluetoothDevices().subscribe((result) => {
      this.printService.setDriver(this.bluetoothDriver, 'ESC/POS');
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
