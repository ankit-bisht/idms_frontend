import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionReportsComponent } from './commission-reports.component';

describe('CommissionReportsComponent', () => {
  let component: CommissionReportsComponent;
  let fixture: ComponentFixture<CommissionReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
