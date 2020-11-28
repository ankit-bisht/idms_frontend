import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAddressComponent } from './group-address.component';

describe('GroupAddressComponent', () => {
  let component: GroupAddressComponent;
  let fixture: ComponentFixture<GroupAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
