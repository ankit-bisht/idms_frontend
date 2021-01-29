import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCarrierContactsComponent } from './new-carrier-contacts.component';

describe('NewCarrierContactsComponent', () => {
  let component: NewCarrierContactsComponent;
  let fixture: ComponentFixture<NewCarrierContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCarrierContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCarrierContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
