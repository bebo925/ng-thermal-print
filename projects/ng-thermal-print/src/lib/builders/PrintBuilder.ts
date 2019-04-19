export abstract class PrintBuilder {
    public abstract init();
    /**
     *
     * @param cutType fill|partial
     */
    public abstract cut(cutType: string);
    public abstract flush(): any;
    public abstract feed(lineCount: number);
    public abstract setInverse(value: boolean);
    public abstract setBold(value: boolean);
    /**
     *
     * @param value left\center\right
     */
    public abstract setJustification(value: string);
    /**
     *
     * @param value normal\large
     */
    public abstract setSize(value: string);
    public abstract setUnderline(value: boolean);
    public abstract writeLine(text: string);
}