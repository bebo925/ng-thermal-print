import { PrintBuilder } from './PrintBuilder';
import { PrintBuffer } from "./PrintBuffer";
declare var TextEncoder: any;

const ESC = 0x1b;
const GS = 0x1D;

export class StarPrintBuilder extends PrintBuilder {
    private encoder = new TextEncoder();
    private buffer: PrintBuffer;

    constructor() {
        super();
    }

    init(): StarPrintBuilder {
        this.buffer = new PrintBuffer();
        this.write(ESC);
        this.write("@");
        return this;
    }

    flush(): Uint8Array {
        return this.buffer.flush();
    }

    feed(lineCount: number = 1): StarPrintBuilder {
        this.write(ESC);
        this.write("a");
        this.write(lineCount);

        return this;
    }

    cut(cutType: string = 'full'): StarPrintBuilder {
        this.write(ESC);
        this.write("d");
        this.write(cutType === 'full' ? 2 : 3);

        return this;
    }

    writeLine(value: string): StarPrintBuilder {
        return this.write(`${value}\n`);
    }

    setInverse(inverse: boolean = true): StarPrintBuilder {
        this.write(ESC);
        (inverse) ? this.write("4") : this.write("5");

        return this;
    }

    setUnderline(underline: boolean = true): StarPrintBuilder {
        this.write(ESC);
        this.write("-");
        this.write(underline ? 1 : 0);
        return this;
    }

    setJustification(value: string): StarPrintBuilder {
        let alignment;
        switch (value) {
            case "center":
                alignment = 1
                break;
            case "right":
                alignment = 2;
                break;
            default:
                alignment = 0;
                break;
        }

        this.write(ESC);
        this.write(GS);
        this.write("a");
        this.write(alignment);

        return this;
    }

    setBold(bold: boolean = true): StarPrintBuilder {
        this.write(ESC);
        (bold) ? this.write("E") : this.write("F");

        return this;
    }

    setSize(size: string): StarPrintBuilder {
        this.write(ESC);
        this.write("i");
        this.write((size === 'normal') ? 0 : 1);
        this.write((size === 'normal') ? 0 : 1);

        return this;
    }

    private write(value: string | Uint8Array | number): any {
        if (typeof value === "number") {
            this.buffer.writeUInt8(value);
        } else if (typeof value === "string") {
            this.buffer.write(this.encoder.encode(value));
        } else {
            this.buffer.write(value);
        }
        return this;
    }
}