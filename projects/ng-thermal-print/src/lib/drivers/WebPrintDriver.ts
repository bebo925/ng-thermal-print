import { BehaviorSubject } from 'rxjs';
import { PrintDriver } from "./PrintDriver";
import { StarWebPrintTrader } from '../js/StarWebPrintTrader.js';

export class WebPrintDriver extends PrintDriver {
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private trader: any;
    private url: string;
    private useSecure: boolean = false;
    public isStarPrinter: boolean = false;


    constructor(url: string, useSecure: boolean = false) {
        super();
        this.url = url;
        this.useSecure = useSecure;
    }

    public connect() {
        const useSecure = (this.useSecure) ? 's' : '';
        this.trader = new StarWebPrintTrader({ url: `http${useSecure}://${this.url}/StarWebPRNT/SendMessage` });

        this.trader.onReceive = (response) => {
            this.isConnected.next(true);
        }

        this.trader.onError = (response) => {
            this.isConnected.next(false);
        }
        this.trader.sendMessage('');
    }

    public async write(data: string): Promise<void> {
        this.trader.sendMessage({ request: data });
    }

}