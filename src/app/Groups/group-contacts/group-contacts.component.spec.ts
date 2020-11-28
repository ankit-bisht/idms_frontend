import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupContactsComponent } from './group-contacts.component';

describe('GroupContactsComponent', () => {
  let component: GroupContactsComponent;
  let fixture: ComponentFixture<GroupContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
