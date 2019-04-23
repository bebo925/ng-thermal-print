import { PrintBuilder } from './PrintBuilder';
import { StarWebPrintBuilder } from '../js/StarWebPrintBuilder.js';

export class WebPrintBuilder extends PrintBuilder {
    private builder: any = new StarWebPrintBuilder();
    private request: string;

    constructor() {
        super();
    }

    public init(): WebPrintBuilder {
        this.request += this.builder.createInitializationElement();
        return this;
    }

    public setJustification(value: string = 'left'): WebPrintBuilder {
        this.request += this.builder.createAlignmentElement({ position: value });
        return this;
    }

    public setBold(value: boolean = true): WebPrintBuilder {
        this.request += this.builder.createTextElement({ emphasis: value });
        return this;
    }

    public setUnderline(value: boolean = true): WebPrintBuilder {
        this.request += this.builder.createTextElement({ underline: value });
        return this;
    }

    public setInverse(value: boolean = true): WebPrintBuilder {
        this.request += this.builder.createTextElement({ invert: value });
        return this;
    }

    public writeLine(value: string): WebPrintBuilder {
        this.request += this.builder.createTextElement({ data: `${value}\n` });
        return this;
    }

    public setSize(size: string = 'normal'): WebPrintBuilder {
        let fontSize;
        switch (size) {
            case 'large':
                fontSize = 2
                break;
            default:
                fontSize = 'normal'
                break;
        }
        this.request += this.builder.createTextElement({ width: fontSize, height: fontSize });
        return this;
    }

    public cut(type: string = 'full'): WebPrintBuilder {
        this.request += this.builder.createCutPaperElement({ feed: true, type: type });
        return this;
    }

    public feed(lines: number = 1): WebPrintBuilder {
        this.request += this.builder.createFeedElement({ line: lines });
        return this;
    }

    public flush(): string {
        return this.request;
    }
}