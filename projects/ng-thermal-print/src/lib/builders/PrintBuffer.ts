// Hat-tip to Håvard Lian @ https://github.com/haavardlian/escpos
export class PrintBuffer {
    private buffer: Uint8Array;
    private size: number;

    constructor(size: number = 1024) {
        this.buffer = new Uint8Array(size);
        this.size = 0;
    }

    clear(): void {
        this.size = 0;
    }

    flush(): Uint8Array {
        const buffer = new Uint8Array(this.buffer.slice(0, this.size));
        this.size = 0;
        return buffer;
    }

    write(data: ArrayLike<number>): PrintBuffer {
        this.resize(data.length);
        this.buffer.set(data, this.size);
        this.size += data.length;
        return this;
    }


    writeUInt8(value: number): PrintBuffer {
        this.resize(1);
        this.buffer[this.size++] = value & 0xFF;
        return this;
    }

    private resize(need: number): void {
        const remaining = this.buffer.length - this.size;
        if (remaining < need) {
            const oldBuffer = this.buffer;
            const factor = Math.ceil((need - remaining) / oldBuffer.length) + 1;
            this.buffer = new Uint8Array(oldBuffer.length * factor);
            this.buffer.set(oldBuffer, 0);
        }
    }
}