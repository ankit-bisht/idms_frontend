import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCarrierCommissionComponent } from './new-carrier-commission.component';

describe('NewCarrierCommissionComponent', () => {
  let component: NewCarrierCommissionComponent;
  let fixture: ComponentFixture<NewCarrierCommissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCarrierCommissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCarrierCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
