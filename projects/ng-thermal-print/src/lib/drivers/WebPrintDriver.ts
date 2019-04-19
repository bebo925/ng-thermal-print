import { BehaviorSubject } from 'rxjs';
import { PrintDriver } from "./PrintDriver";
import { StarWebPrintTrader } from '../../../../../js/StarWebPrintTrader.js';

export class WebPrintDriver extends PrintDriver {
    public isConnected: BehaviorSubject<boolean>;
    private trader: any;
    private url: string;

    constructor(url: string) {
        super();
        this.url = url;
    }

    public connect() {
        this.trader = new StarWebPrintTrader({ url: `http://${this.url}/StarWebPRNT/SendMessage` });

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