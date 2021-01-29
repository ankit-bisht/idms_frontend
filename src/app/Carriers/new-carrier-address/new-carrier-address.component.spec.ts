import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCarrierAddressComponent } from './new-carrier-address.component';

describe('NewCarrierAddressComponent', () => {
  let component: NewCarrierAddressComponent;
  let fixture: ComponentFixture<NewCarrierAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCarrierAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCarrierAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
