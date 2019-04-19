import { WebPrintBuilder } from './builders/WebPrintBuilder';
import { PrintBuilder } from 'projects/ng-thermal-print/src/lib/builders/PrintBuilder';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PrintDriver } from './drivers/PrintDriver';
import { EscBuilder } from './builders/EscBuilder';

@Injectable({
  providedIn: 'root'
})
export class EscPosPrintService extends PrintBuilder {
  public driver: PrintDriver;
  public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public builder: PrintBuilder;

  constructor() {
    super();
  }

  setDriver(driver: PrintDriver): EscPosPrintService {
    this.driver = driver;


    this.driver.connect();

    this.driver.isConnected.subscribe(result => {
      this.isConnected.next(result);
    });


    return this;
  }

  /**
   * Initialize a new print queue
   */
  init(): EscPosPrintService {
    if (!this.isConnected.value) {
      throw "Cannot initiate the print service.  No connection detected.";
    }

    switch (this.driver.constructor.name) {
      case 'WebPrintDriver':
        this.builder = new WebPrintBuilder();
        break;
      case 'UsbDriver':
        this.builder = new EscBuilder();
        break;
    }
    this.builder.init();
    return this;
  }

  /**
   *
   * @param cutType full|partial
   */
  public cut(cutType: string = 'full'): EscPosPrintService {
    this.builder.cut(cutType);
    return this;
  }

  /**
   *
   * @param lineCount How many lines to feed
   */
  public feed(lineCount: number = 1): EscPosPrintService {
    this.builder.feed(lineCount);
    return this;
  }

  setInverse(value: boolean = true): EscPosPrintService {
    this.builder.setInverse(value);
    return this;

  }

  setBold(value: boolean = true): EscPosPrintService {
    this.builder.setBold(value);
    return this;

  }

  setUnderline(value: boolean = true): EscPosPrintService {
    this.builder.setUnderline(value);
    return this;

  }

  /**
   *
   * @param value left|center\right
   */
  setJustification(value: string = 'left'): EscPosPrintService {
    this.builder.setJustification(value);
    return this;
  }

  /**
   *
   * @param value normal|large
   */
  setSize(value: string = 'normal'): EscPosPrintService {
    this.builder.setSize(value);
    return this;
  }

  /**
   *
   * @param text
   */
  writeLine(text: string = ''): EscPosPrintService {
    this.builder.writeLine(text);
    return this;
  }

  /**
   * write the current builder value to the driver and clear out the builder
   */
  flush() {
    this.driver.write(this.builder.flush());
  }
}
