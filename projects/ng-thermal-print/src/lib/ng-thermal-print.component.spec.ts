import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscPosPrintComponent } from './ng-thermal-print.component';

describe('EscPosPrintComponent', () => {
  let component: EscPosPrintComponent;
  let fixture: ComponentFixture<EscPosPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EscPosPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscPosPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
