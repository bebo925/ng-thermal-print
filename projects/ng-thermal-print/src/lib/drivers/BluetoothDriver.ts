import { PrintDriver } from "./PrintDriver";
import { BehaviorSubject, Observable } from "rxjs";

export class BluetoothDriver extends PrintDriver {
    device: any;
    characteristic: any;
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
    public connect(): void {
      this.device.gatt.connect()
        .then((server) => {
          this.isConnected.next(true);
          return server.getPrimaryService("000018f0-0000-1000-8000-00805f9b34fb")
        })
        .then(service => service.getCharacteristic("00002af1-0000-1000-8000-00805f9b34fb"))
        .then((characteristic) => {
          this.isConnected.next(true);
          this.characteristic = characteristic;
        })
      ;
    }
  
    public write(data: any): void {
      const array_chunks = (array, chunkSize) => {
        var chunks = [];
        for (let i=0, len = array.length; i < len; i += chunkSize)
          chunks.push(array.slice(i,i+chunkSize));
        return chunks;
      };
  
      const chunks = array_chunks(data, 20);
      let index = 1;
      for (let chunk of chunks) {
        setTimeout(() => {
  
          this.characteristic.writeValue(chunk)
        }, 100 + index * 100);
  
        index++;
      }
    }
  
    public requestForBluetoothDevices(): Observable<any> {
      let mobileNavigator: any = window.navigator;
      return new Observable(observer => {
        mobileNavigator.bluetooth.requestDevice({
          filters: [{
            services: ['000018f0-0000-1000-8000-00805f9b34fb']
          }]
        })
          .then((device) => {
            this.device = device;
            return observer.next(device);
          })
          .catch(error => {
            return observer.error(error.message);
          });
      });
    }
}