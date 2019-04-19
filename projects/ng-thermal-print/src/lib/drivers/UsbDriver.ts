import { BehaviorSubject } from 'rxjs';
import { PrintDriver } from "./PrintDriver";
declare var navigator: any;

export class UsbDriver extends PrintDriver {
    private device: any;
    private endPoint: any;
    private vendorId: number;
    private productId: number;
    public isStarPrinter: boolean = false;

    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(vendorId?: number, productId?: number) {
        super();
        this.vendorId = vendorId;
        this.productId = productId;
    }

    public connect() {

        navigator.usb.getDevices().then(devices => {
            this.device = devices.find((device: any) => {
                return device.vendorId === this.vendorId && device.productId === this.productId;
            });

            if (this.device.productName.toLowerCase().includes('star micro')) {
                this.isStarPrinter = true;
            }
            console.log(this.device);
            return this.device.open();
        })
            .then(() => {
                let result = this.device.selectConfiguration(1);
                return result;
            })
            .then(() => {

                let result = this.device.claimInterface(0);
                return result;
            }).then(result => {
                const endPoints = this.device.configuration.interfaces[0].alternate.endpoints;
                this.endPoint = endPoints.find((endPoint: any) => endPoint.direction === 'out');
                this.isConnected.next(true);
                this.listenForUsbConnections();
            }).catch(result => {
            });
    }

    public requestUsb() {
        return navigator.usb.requestDevice({ filters: [] }).then(result => {
            this.vendorId = result.vendorId;
            this.productId = result.productId;
            return result;
        });
    }

    public async write(data: Uint8Array): Promise<void> {
        this.device.transferOut(this.endPoint.endpointNumber, data);
    }

    private listenForUsbConnections(): void {
        navigator.usb.addEventListener('disconnect', device => {
            this.isConnected.next(false)
        });
        navigator.usb.addEventListener('connect', event => {
            this.isConnected.next(true);
        });
    }
}