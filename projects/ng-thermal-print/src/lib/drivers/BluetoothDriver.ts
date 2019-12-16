import { PrintDriver } from "./PrintDriver";
import { BehaviorSubject, Observable } from "rxjs";

export class BluetoothDriver extends PrintDriver {
    device: any;
    public isConnected: BehaviorSubject<boolean>;    
    
    public connect(): void {
       this.device.gatt.connect().then((server) => {
        this.isConnected.next(true);
            // TODO: Obtain service.
            // TODO: Obtain characteristics.
       });
    }

    public write(data: any): void {
        
    }

    public requestForBluetoothDevices(): Observable<any> {
        let mobileNavigator: any = window.navigator;
        return new Observable(observer => {
            mobileNavigator.bluetooth.requestDevice({
                acceptAllDevices: true 
            })
            .then((device) => {
                
            })
            .catch(error => {
                return observer.error(error.message);
            });
        });
    }
}